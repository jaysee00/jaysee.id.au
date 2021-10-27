import * as fs from 'fs-extra';
import * as path from 'path';

import * as log from '../util/log.js';
import config from '../config.js';
import {Graph, GraphItem} from './graph.js';

export const collect = (): Promise<Graph> => {
    return Promise.resolve(
        new Graph(
            [
                collectDir(config.srcDir, config.srcDir), 
                collectDir(config.assetsDir, config.assetsDir)
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
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            return collectDir(fullPath, root);
        }
        else
        {
            return new GraphItem(fullPath, dir, true, false);
        }
    });

    return new GraphItem(path.resolve(dir), root, false, true, items);
}
