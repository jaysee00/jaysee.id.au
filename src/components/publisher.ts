import fs from 'fs-extra';
import path from 'path';

import { Graph, GraphItem } from './graph';
import * as log from '../util/log';
import config from '../config';

const publishItem = (item: GraphItem) => {
    if (item.isDirectory) {
        fs.ensureDirSync(item.absolutePath);
    } else {
        const contents = item.getContents();
        fs.writeFileSync(item.absolutePath, contents);
    }
}

const publish = (graph: Graph) => {
    const fullOutPath = path.resolve(config.outDir);
    log.msg(`Publishing to output directory`);
    log.msg(`> Output dir: ${fullOutPath}`);
    log.msg(`> ${graph.size()} files to publish`);
    // TODO: Make this optional.
    fs.rmSync(fullOutPath, {recursive: true});



    graph.visit(publishItem);
}

export default publish;