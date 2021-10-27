import * as fs from 'fs-extra';
import * as path from 'path';
import minimatch, { match } from 'minimatch';
import assert from 'assert';

import * as log from '../util/log.js';
import { GraphItemFilter } from '../config.js';
import RenderContext from './renderContext.js';

type ReducerFuncType = (acc: GraphItem[], item: GraphItem) => GraphItem[];

const matchFunc = (path: string, pattern: string): boolean => {
    // log.msg(`Comparing path ${path} to pattern ${pattern}`);
    const result = minimatch(path, pattern, {matchBase: true});
    // log.alert(`\tResult: ${result}`);
    return result;
};

const getReducer = (itemFilter: GraphItemFilter): ReducerFuncType => {
    const reducerFunc: ReducerFuncType = (val, i) => {
        if (i.isFile) {

            const inclMatch = matchFunc(i.absolutePath, itemFilter.include);
            var match;
            if (itemFilter.exclude) {
                match = inclMatch && !matchFunc(i.absolutePath, itemFilter.exclude);
            }
            else {
                match = inclMatch;
            }

            if (match) {
                // log.success(`Item ${i.fileName} is included in the filter`);
                val.push(i);
            }
        } else {
            assert.strictEqual(i.isDirectory, true, `Expected ${i.fileName} to be a directory. ${JSON.stringify(i)}`);

            const filteredItems = i.items.reduce(getReducer(itemFilter), new Array<GraphItem>());
            const isDirMatch = filteredItems.length > 0;
            if (isDirMatch) {
                // log.success(`Dir ${i.fileName} is included in the filter because it has ${filteredItems.length} matching children`);
            
                const newItem = i.clone();
                newItem.items = filteredItems;
                val.push(newItem);
            }
        }
        return val;
    }
    return reducerFunc;
}

export class GraphItem {
    fileName: string;
    extension: string;
    absolutePath: string;
    relativePath: string;
    rootPath: string
    isFile: boolean;
    isDirectory: boolean;
    items: GraphItem[];
    context: RenderContext;

    constructor(absolutePath: string, rootPath: string, isFile: boolean, isDirectory: boolean, items: GraphItem[] = new Array<GraphItem>()) {
        this.fileName = path.basename(absolutePath);
        this.extension = path.extname(this.fileName);
        this.absolutePath = absolutePath;
        this.relativePath = path.resolve(rootPath, absolutePath);
        this.rootPath = rootPath;
        this.isFile = isFile;
        this.isDirectory = isDirectory;
        this.items = items;
        this.context = new RenderContext();
    }

    clone(): GraphItem {
        return new GraphItem(
            this.absolutePath,
            this.rootPath,
            this.isFile,
            this.isDirectory, 
            this.items
        );
    }

    add(item: GraphItem) {
        log.debug(`Adding ${item.fileName} to ${this.fileName}`);
        if (!this.isDirectory) {
            throw new Error("Cannot add new child items if parent item is not a directory");
        }

        // eg. I'm ~/out/assets/
        // eg. item is ~/out/assets/foo/bar.png
        const relativePath = path.relative(this.absolutePath, item.absolutePath);

        const bits = relativePath.split('/');
        if (bits.length == 1) {
            // the item is a direct child of this one!
            log.debug(`\tAdding as direct child`);
            this.items.push(item);
        } else {
            assert.strictEqual(bits.length >= 2, true);
            log.debug(`\tAdding as descendant`);

            // the item is a child of this item's child. 
            const intermediateParent = new GraphItem(
                path.join(this.absolutePath, bits[0]),
                item.rootPath,
                false,
                true,
                new Array<GraphItem>()                
            );
            intermediateParent.add(item);
        }
    }

    getContents(): Buffer {
        if (this.isDirectory) {
            throw new Error("Directory has no contents");
        }
        return fs.readFileSync(this.absolutePath);
    }
    visit(visitFn: (item: GraphItem)=>void): GraphItem {
        visitFn(this);
        this.items.forEach(i=>i.visit(visitFn));
        return this;
    }
}

export class Graph {
    items: GraphItem[];

    constructor(items: GraphItem[]) {
        this.items = items;
    }

    add(item: GraphItem) {
        log.debug(`Adding ${item.fileName} to graph`);
        let rootItem = this.items.find((i) => (i.absolutePath === item.rootPath));
        if (!rootItem) {
            log.debug(`Graph needs new root item ${item.rootPath}`);
            rootItem = new GraphItem(
                item.rootPath,
                item.rootPath,
                false,
                true,
                new Array<GraphItem>()
            );
            this.items.push(rootItem);
        }
        rootItem.add(item);
    }

    /**
     * IMPORTANT: This actually uses `Array.prototype.reduce()` rather than `Array.prototype.filter()`
     */
    filter(filter: GraphItemFilter): Graph {
        const filteredItems: GraphItem[] = this.items.reduce(getReducer(filter), new Array<GraphItem>());
        return new Graph(filteredItems);
    }

    visit(visitFn: (item: GraphItem)=>void): Graph {
        this.items.forEach((i) => {
            i.visit(visitFn);
        });

        return this;
    }
}

export interface GraphOperator {
    run: (arg0: Graph) => void;
}
