import path from 'path';
import moment from 'moment';

import { Graph, GraphItem } from "../graph";
import renderContext from "../renderContext";
import { Renderer } from "../renderer";
import * as log from '../../util/log';
import config, { GraphItemFilter, RenderDef } from "../../config";
import getTemplate from '../template';
import RenderContext from '../renderContext';
import { ContentListMarkdownRenderer } from './contentListMarkdownRenderer';

export class ListPageMarkdownRenderer implements Renderer {

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

            // TODO: Should this be here, or in a pre-renderer?
            const filterFunc = (i: GraphItem) => {
                const fm = i.context.get('fm');
                if (!fm) {
                    return false;
                }
                return (fm.attributes.listType === this.options.listType);
            }
            const listItems = inputGraph.filter(filterFunc).flatten();
            // TODO: Consider slicing to only show the top 10 entries, or introduce pagination.
            // TODO: Ensure entries are sorted by reverse chronological publish date.
            context.set('entries', listItems.map((i) => {
                // TODO: This logic needs to be coupled to the url publishing logic in contentListMarkdownRenderer
                const attributes = i.context.get('fm').attributes;
                var itemUrl;
                if (attributes.publishUrlFormat && attributes.publishUrlFormat === 'blogWithTimestamp') {
                    const publishDate = moment(attributes.date, 'YYYY-MM-DD').format('YYYY/MM/DD');
                    itemUrl = `${attributes.listType}/${publishDate}/${path.parse(i.fileName).name}.html`;
                }
                else {
                    itemUrl = `${attributes.listType}/${path.parse(i.fileName).name}.html`;
                }                
                i.context.set('url', itemUrl);
                return i.context.hbsIt();
            }));

            // Render
            const templateContext = context.smoosh(item.context);
            const renderedOutput = template(templateContext.hbsIt());

            const rootOutputDir = path.resolve(config.outDir);
            // Push to output graph    
            const outputPath = path.join(rootOutputDir, this.options.outputPath);            
            const renderedItem = new GraphItem(outputPath, rootOutputDir, true, false);
            renderedItem.getContents = () => Buffer.from(renderedOutput);

            outputGraph.add(renderedItem);
        }
    }   

    run(inputGraph: Graph, outputGraph: Graph, context: renderContext) {
        inputGraph.filter(this.filter).visit(this.getItemRenderer(inputGraph, outputGraph, context.clone()))
    }
}
