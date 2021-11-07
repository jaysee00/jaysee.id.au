import config, {PreprocessorDef} from '../config.js';
import {Graph, GraphItem, GraphOperator} from './graph.js';
import * as log from '../util/log.js';
import CssPreprocessor from './preprocessors/cssPreprocessor.js';
import FmPreprocessor from './preprocessors/fmPreprocessor.js';

const getPreprocessor = (def: PreprocessorDef): GraphOperator => {
    switch (def.type) {
        case "cssPreprocessor":
            return new CssPreprocessor(def);
        case "fmPreprocessor":
            return new FmPreprocessor(def);
        default:
            throw new Error(`Unknown preprocessor type ${def.type}`);
    }
};

export const preprocess = (graph: Graph): Promise<Graph> => {
    // Load pre-processors
    log.msg("Loading preprocessors");
    config.preprocess.forEach(def => {
        log.msg(`Loading preprocessor for ${def.name}`);
        const preprocessor = getPreprocessor(def);
        preprocessor.run(graph);
    });

    return Promise.resolve(graph);
}