import * as fs from 'fs-extra';
import * as path from 'path';

import * as log from '../util/log.js';
import config from '../config.js';
import {Graph, GraphItem} from './types.js';

export const collect = (): Graph => {
    return {
        items: [collectDir(config.srcDir), collectDir(config.assetsDir)]
    };
};

const collectDir = (dir: string): GraphItem => {
    log.success(`Collecting files from ${dir}`);

    if (!fs.existsSync(dir)) {
        throw new Error(`Directory ${dir} does not exist.`);
    }

    const entries: string[] = fs.readdirSync(dir);
    const items: GraphItem[] = entries.map(file => {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            return collectDir(fullPath);
        }
        else
        {
            console.log(`\tCollecting ${file}`);
            const fileExtension = path.extname(file);

            return {
                fileName: path.basename(file),
                extension: fileExtension,
                absolutePath: fullPath,
                isFile: true,
                isDirectory: false,
                items: null,
                getContents: () => { return fs.readFileSync(fullPath);}
            }
        }
    });

    return {
        fileName: path.basename(dir),
        extension: '',
        absolutePath: '', // TODO: Fix me. 
        isFile: false,
        isDirectory: true,
        items: items,
        getContents: () => { throw new Error("Directory has no contents");}
    }
}
