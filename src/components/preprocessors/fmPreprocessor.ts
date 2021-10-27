import fm from 'front-matter';

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
        log.msg(`Running FrontMatter preprocessor`);
        graph.filter(this.filter).visit(this.processGraphItem)
    }

    processGraphItem(item: GraphItem) {        
        if (!item.isFile) {
            return;
        }

        log.debug(`Processing ${item.fileName}`);
        const node = fm(item.getContents().toString());
        item.context.set('fm', node);
    };
}
