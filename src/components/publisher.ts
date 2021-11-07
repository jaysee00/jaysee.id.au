import fs from 'fs-extra';

import { Graph, GraphItem } from './graph';
import * as log from '../util/log';
import config from '../config';

const publishItem = (item: GraphItem) => {
    if (item.isDirectory) {
        log.debug(`Ensuring dir ${item.absolutePath}`);
        fs.ensureDirSync(item.absolutePath);
    } else {
        const contents = item.getContents();
        fs.writeFileSync(item.absolutePath, contents);
    }
}

const publish = (graph: Graph) => {
    log.success(`Running publisher`);
    // TODO: Make this optional.
    fs.rmdirSync(config.outDir, {recursive: true});

    graph.visit(publishItem);
}

export default publish;