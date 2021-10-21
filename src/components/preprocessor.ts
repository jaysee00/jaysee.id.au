import config, {PreprocessorDef} from '../config.js';
import {Graph, GraphItem, Preprocessor} from './Graph.js';
import * as log from '../util/log.js';
import CssPreprocessor from './preprocessors/cssPreprocessor.js';


const getPreprocessor = (def: PreprocessorDef): Preprocessor => {
    switch (def.type) {
        case "cssPreprocessor":
            return new CssPreprocessor(def);
        default:
            throw new Error(`Unknown preprocessor type ${type}`);
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