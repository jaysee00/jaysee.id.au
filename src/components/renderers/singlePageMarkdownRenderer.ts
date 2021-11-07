import path from 'path';

import config, { GraphItemFilter, RenderDef } from "../../config";
import getTemplate from "../template";
import { Graph, GraphItem } from '../graph';
import RenderContext from "../renderContext";
import { Renderer } from "../renderer";
import * as log from '../../util/log';

export class SinglePageMarkdownRenderer implements Renderer {

    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: RenderDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    getItemRenderer(inputGraph: Graph, outputGraph: Graph, context: RenderContext): (arg0: GraphItem) => void {
        // TODO: Compile template on construction?
        const template = getTemplate(this.options.template);

        return (item: GraphItem) => {
            // TODO: All renderers seem to have the same boilerplate here - can I reduce? 
            if (item.isDirectory) {
                return;
            }

            if (this.options.crumbs) {
                if (typeof this.options.crumbs === "function") {
                    context.set('crumbs', this.options.crumbs(item));
                } 
                else {
                    context.set('crumbs', this.options.crumbs);
                }
            }
            // Render
            const templateContext = context.smoosh(item.context);
            const renderedOutput = template(templateContext.hbsIt());

            // Push to output graph
            const fullOutPath = path.resolve(config.outDir)
            const outputPath = path.join(fullOutPath, './index.html');

            const renderedItem = new GraphItem(outputPath, fullOutPath, true, false);
            renderedItem.getContents = () => Buffer.from(renderedOutput);

            outputGraph.add(renderedItem);
        }
    }

    run(inputGraph: Graph, outputGraph: Graph, context: RenderContext) {
        log.msg(`Running ${this.name} Single Page Markdown renderer`);
        inputGraph.filter(this.filter).visit(this.getItemRenderer(inputGraph, outputGraph, context.clone()))
    }

}