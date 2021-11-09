import path from 'path';
import moment from 'moment';

import config, { GraphItemFilter, RenderDef } from "../../config";
import { Graph, GraphItem } from "../graph";
import renderContext from "../renderContext";
import { Renderer } from "../renderer";
import * as log from '../../util/log';
import getTemplate from "../template";
import RenderContext from "../renderContext";

export class ContentListMarkdownRenderer implements Renderer {

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

            const attributes = item.context.get('fm').attributes;

            // Push to output graph   
            // TODO: This logic needs to be coupled to the URL logic in listPageMarkdownRenderer 
            const rootOutputPath = path.resolve(config.outDir); 
            let outputPath = '';
            if (attributes.publishUrlFormat && attributes.publishUrlFormat === 'blogWithTimestamp') {
                const publishDate = moment(attributes.date, 'YYYY-MM-DD').format('YYYY/MM/DD');
                outputPath = path.join(rootOutputPath, this.options.outputPath, publishDate, `${path.parse(item.fileName).name}.html`);
            } else {
                outputPath = path.join(rootOutputPath, this.options.outputPath, `${path.parse(item.fileName).name}.html`);
            }
            
            const renderedItem = new GraphItem(outputPath, rootOutputPath, true, false);
            renderedItem.getContents = () => Buffer.from(renderedOutput);

            outputGraph.add(renderedItem);
        }
    }   

    run(inputGraph: Graph, outputGraph: Graph, context: renderContext) {
        inputGraph.filter(this.filter).visit(this.getItemRenderer(inputGraph, outputGraph, context.clone()))
    }
}