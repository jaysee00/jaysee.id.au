import config, {PreprocessorDef} from '../config.js';
import {Graph, GraphItem, GraphPreprocessor} from './graph.js';
import * as log from '../util/log.js';
import CssPreprocessor from './preprocessors/cssPreprocessor.js';


const getPreprocessor = (def: PreprocessorDef): GraphPreprocessor => {
    switch (def.type) {
        case "cssPreprocessor":
            return new CssPreprocessor(def);
        default:
            throw new Error(`Unknown preprocessor type ${def.type}`);
    }
};

export const run = (graph: Graph): Graph => {
    // Load pre-processors
    config.preprocess.forEach(def => {
        const preprocessor = getPreprocessor(def);
        preprocessor.process(graph);
    });

    return graph;
}