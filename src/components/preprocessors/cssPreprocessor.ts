import CleanCSS from 'clean-css';

import { GraphItem, Graph, GraphPreprocessor } from '../Graph.js';
import * as log from '../../util/log.js';
import { GraphItemFilter, PreprocessorDef } from '../../config.js';

class CssPreprocessor implements GraphPreprocessor {
    
    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: PreprocessorDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    process(graph: Graph) {
        graph.filter(this.filter).visit(this.processGraphItem)
    }

    processGraphItem(item: GraphItem): GraphItem {
        // minify
        log.msg(`\tProcessing ${item.fileName}`);
        const output = new CleanCSS({}).minify(item.getContents());
    
        item.getContents = () => {
            return Buffer.from(output.styles);
        }
    
        return item;
    };
}



export default CssPreprocessor;

