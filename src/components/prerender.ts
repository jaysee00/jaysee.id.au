import { Graph, GraphOperator } from "./graph"
import config, { PrerenderDef } from '../config';
import BuildInfoPrerenderer from './prerenderers/buildInfoPrerenderer';
import * as log from '../util/log.js';
import RenderContext from "./renderContext";

export type Prerenderer = {
    run: (graph: Graph, context: RenderContext) => Promise<void>;
}

export const prerender = async (graph: Graph): Promise<[Graph, RenderContext]> => {
    const renderContext = new RenderContext();
    
    // Load prerenderers
    for (const def of config.prerender) {
        log.msg(`Running pre-renderer '${def.name}`);
        await getPrerenderer(def).run(graph, renderContext);
    } 
     return Promise.resolve([graph, renderContext]);
}


const getPrerenderer = (def: PrerenderDef): Prerenderer => {
    switch (def.type) {
        case "buildInfoPrerenderer":
            return new BuildInfoPrerenderer();
        default:
            throw new Error(`Unknown prerenderer type ${def.type}`);
    }
};