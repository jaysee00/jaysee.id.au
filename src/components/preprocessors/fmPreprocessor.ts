import fm from 'front-matter';
import { marked } from 'marked';

import { GraphItem, Graph, GraphOperator } from '../graph.js';
import * as log from '../../util/log.js';
import { GraphItemFilter, PreprocessorDef } from '../../config.js';

export default class FmPreprocessor implements GraphOperator {
   
    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: PreprocessorDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    run(graph: Graph) {
        const filteredGraph = graph.filter(this.filter);
        log.msg(`> Filtered ${filteredGraph.size()} files for preprocessing.`);
        filteredGraph.visit(this.processGraphItem)
    }

    processGraphItem(item: GraphItem) {        
        if (!item.isFile) {
            return;
        }

        const node = fm(item.getContents().toString());
        const mdNode: any = {...node};
        mdNode.md = marked(node.body);
        item.context.set('fm', mdNode);
    };
}
