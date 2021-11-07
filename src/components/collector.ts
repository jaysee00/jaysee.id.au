import * as fs from 'fs-extra';
import * as path from 'path';

import * as log from '../util/log.js';
import config from '../config.js';
import {Graph, GraphItem} from './graph.js';

export const collect = (): Promise<Graph> => {
    const fullSrcDir = path.resolve(config.srcDir);
    const fullAssetsDir = path.resolve(config.assetsDir);

    return Promise.resolve(
        new Graph(
            [
                collectDir(fullSrcDir, fullSrcDir), 
                collectDir(fullAssetsDir, fullAssetsDir)
            ]
        )
    );
};

const collectDir = (dir: string, root:string): GraphItem => {
    log.success(`Collecting files from ${dir}`);

    if (!fs.existsSync(dir)) {
        throw new Error(`Directory ${dir} does not exist.`);
    }

    const entries: string[] = fs.readdirSync(dir);
    const items: GraphItem[] = entries.map(file => {
        const fullPath = path.resolve(path.join(dir, file));
        if (fs.lstatSync(fullPath).isDirectory()) {
            return collectDir(fullPath, root);
        } else {
            log.debug(`Collecting ${fullPath}`);
            return new GraphItem(fullPath, root, true, false);
        }
    });
 
    return new GraphItem(path.resolve(dir), root, false, true, items);
}
