import * as fs from 'fs-extra';
import * as path from 'path';
import {Glob} from 'glob';

import { GraphItemFilter } from '../config';

export class GraphItem {
    fileName: string;
    extension: string;
    absolutePath: string;
    relativePath: string;
    isFile: boolean;
    isDirectory: boolean;
    items?: GraphItem[];

    constructor(absolutePath: string, rootPath: string, isFile: boolean, isDirectory: boolean, items: GraphItem[] | null = null) {
        this.fileName = path.basename(absolutePath);
        this.extension = path.extname(this.fileName);
        this.absolutePath = absolutePath;
        this.relativePath = path.resolve(rootPath, absolutePath);
        this.isFile = isFile;
        this.isDirectory = isDirectory;
        this.items = items;
    }

    getContents(): Buffer {
        return fs.readFileSync(this.absolutePath);
    }
}

export class Graph {
    items: GraphItem[];

    constructor(items: GraphItem[]) {
        this.items = items;
    }

    filter(filter: GraphItemFilter): Graph {

        this.items.filter((item) => {
            // TODO: Use minimatch https://github.com/isaacs/minimatch
            

            item.relativePath

        });





        throw new Error("NotImplemented");
    }

    visit(visitFn: (GraphItem)=>GraphItem): Graph {
        throw new Error("NotImplemented");
    }
}

export interface GraphPreprocessor {
    process: (arg0: Graph) => void;
}