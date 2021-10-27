import fs from 'fs-extra';

import { Graph, GraphItem } from './graph';
import * as log from '../util/log';
import config from '../config';

const publishItem = (item: GraphItem) => {
    if (item.isDirectory) {
        log.msg(`Creating directory ${item.absolutePath}`);
        fs.ensureDirSync(item.absolutePath);
    } else {
        log.msg(`Creating file ${item.absolutePath}`);
        fs.writeFileSync(item.absolutePath, item.getContents());
    }
}

const publish = (graph: Graph) => {
    // TODO: Make this optional.
    fs.rmdirSync(config.outDir, {recursive: true});

    graph.visit(publishItem);
}

export default publish;