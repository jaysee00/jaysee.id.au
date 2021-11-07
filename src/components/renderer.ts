import config, { RenderDef } from '../config';
import * as log from '../util/log';
import { Graph, GraphItem } from "./graph";
import RenderContext from './renderContext';
import { AssetCopier } from './renderers/assetCopier';
import { ContentListMarkdownRenderer } from './renderers/contentListMarkdownRenderer';
import { ListPageMarkdownRenderer } from './renderers/listPageMarkdownRenderer';
import { SinglePageMarkdownRenderer } from "./renderers/singlePageMarkdownRenderer";

export const render = (inputGraph: Graph, context: RenderContext): Graph => {
    const outputGraph = new Graph(new Array<GraphItem>());
    
    // Trigger each configured render behaviour 
    log.msg("Loading renderer behaviours");
    config.render.forEach((def) => {
        log.msg(`Running ${def.name} renderer`);
        const renderer = getRenderer(def);
        renderer.run(inputGraph, outputGraph, context);
     });
    return outputGraph;
}

export type Renderer = {
    run: (inputGraph: Graph, outputGraph: Graph, context: RenderContext) => void;
}

const getRenderer = (def: RenderDef): Renderer => {
    switch (def.type) {
        case "singlePageMarkdownRenderer":
            return new SinglePageMarkdownRenderer(def);
        case "contentListMarkdownRenderer":
            return new ContentListMarkdownRenderer(def);
        case "listPageMarkdownRenderer":
            return new ListPageMarkdownRenderer(def);
        case "assetCopier":
            return new AssetCopier(def);
        default:
            throw new Error(`Unknown renderer type ${def.type}`);
    }
};
