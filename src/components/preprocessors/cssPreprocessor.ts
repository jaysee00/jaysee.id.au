import CleanCSS from 'clean-css';

import { GraphItem, Graph, GraphOperator } from '../graph.js';
import * as log from '../../util/log.js';
import { GraphItemFilter, PreprocessorDef } from '../../config.js';

class CssPreprocessor implements GraphOperator {
    
    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: PreprocessorDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    run(graph: Graph) {
        log.msg(`Running CSS preprocessor`);
        graph.filter(this.filter).visit(this.processGraphItem)
    }

    processGraphItem(item: GraphItem) {
        if (!item.isFile) {
            return;
        }

        // minify
        log.msg(`Minifying ${item.fileName}`);
        const output = new CleanCSS({}).minify(item.getContents());
    
        item.getContents = () => {
            return Buffer.from(output.styles);
        }
    };
}

export default CssPreprocessor;
