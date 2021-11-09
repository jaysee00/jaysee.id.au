import * as fs from 'fs-extra';
import * as path from 'path';
import assert from 'assert';

import match from '../util/match';
import * as log from '../util/log.js';
import { GraphItemFilter } from '../config.js';
import RenderContext from './renderContext.js';

type ReducerFuncType = (acc: GraphItem[], item: GraphItem) => GraphItem[];

const getReducer = (itemFilter: GraphItemFilter | GraphItemPredicate): ReducerFuncType => {
    const reducerFunc: ReducerFuncType = (val, i) => {
        if (i.isFile) {
            let itemIsAMatch: boolean;
            if (typeof itemFilter === "function") {
                // Must be a GraphItemPredicate.
                const predicate = itemFilter as GraphItemPredicate;
                itemIsAMatch = predicate(i);
            }
            else {
                // Must be a GraphItemFilter
                const inclMatch = match(i.absolutePath, itemFilter.include);
                var isMatch;
                if (itemFilter.exclude) {
                    itemIsAMatch = inclMatch && !match(i.absolutePath, itemFilter.exclude);
                }
                else {
                    itemIsAMatch = inclMatch;
                }
            }
            if (itemIsAMatch) {
                val.push(i);
            }  
        } else {
            assert.strictEqual(i.isDirectory, true, `Expected ${i.fileName} to be a directory. ${JSON.stringify(i)}`);

            const filteredItems = i.items.reduce(getReducer(itemFilter), new Array<GraphItem>());
            const isDirMatch = filteredItems.length > 0;
            if (isDirMatch) {            
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
        this.relativePath = path.relative(rootPath, absolutePath);
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
        if (!this.isDirectory) {
            throw new Error("Cannot add new child items if parent item is not a directory");
        }
        const relativePath = path.relative(this.absolutePath, item.absolutePath);

        const bits = relativePath.split('/');
        if (bits.length == 1) {
            // the item is a direct child of this one!
            // Ensure no duplicates
            const existing = this.items.find(i=>i.fileName === item.fileName);
            if (existing) {
                throw new Error(`Item ${this.fileName} already has a child called ${item.fileName}.`);
            }

            this.items.push(item);
        } else {
            assert.strictEqual(bits.length >= 2, true);
            // the item is a child of this item's child.
            const existing = this.items.find(i=>i.fileName === bits[0]);
            if (existing) {
                existing.add(item);
            }
            else {
                const intermediateParent = new GraphItem(
                    path.join(this.absolutePath, bits[0]),
                    item.rootPath,
                    false,
                    true,
                    new Array<GraphItem>()                
                );
                this.items.push(intermediateParent);
                intermediateParent.add(item); 
            }         
        }
    }

    _readContents(file: string): Buffer {
        if (this.isDirectory) {
            throw new Error("Directory has no contents");
        }
        return fs.readFileSync(file);
    }

    getContents(): Buffer {
        return this._readContents(this.absolutePath);
    }
    visit(visitFn: (item: GraphItem)=>void): GraphItem {
        visitFn(this);
        this.items.forEach(i=>i.visit(visitFn));
        return this;
    }

    toLogString(indent: number = 0): string {

        let indentStr = "";
        for(var i = 0; i < indent; i++){
            indentStr += " ";
        }
        let outStr = `${indentStr}- ${this.fileName}\r\n`;
        this.items.forEach(i => {
            outStr += i.toLogString(indent+1);
        });
        return outStr;
    }

    flatten(dirs: boolean = false): GraphItem[] {  
        if (this.isFile) {
            return [this];
        }
        else {
            assert.strictEqual(this.isDirectory, true);
            let results: GraphItem[] = dirs ? [this] : [];
            this.items.forEach(i=>{
                results = results.concat(i.flatten());
            });
            return results;
        }
    }
}

type GraphItemPredicate = (arg0: GraphItem) => boolean;

export class Graph {
    items: GraphItem[];

    constructor(items: GraphItem[]) {
        this.items = items;
    }

    flatten(dirs: boolean = false): GraphItem[] {
        let result: GraphItem[] = [];
        this.items.forEach((i) => {
            result = result.concat(i.flatten(dirs));
        });
        return result;
    }

    size(filesOnly: boolean = true): number {
        let counter = 0;
        this.visit((i) => i.isFile || !filesOnly ? counter++ : null);
        return counter;
    }

    toLogString(): string {
        let str = "";
        this.items.forEach(i => {
            str += `(r) ${i.toLogString()}`;
        });
        return str;
    }

    add(item: GraphItem) {
        let rootItem = this.items.find((i) => (i.absolutePath === item.rootPath));
        if (!rootItem) {
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
    filter(filter: GraphItemFilter | GraphItemPredicate): Graph {
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
