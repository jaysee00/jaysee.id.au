import path from 'path';

import { Renderer } from "../renderer";
import { Graph, GraphItem } from '../graph';
import config, { GraphItemFilter, RenderDef } from "../../config";
import RenderContext from "../renderContext";
import * as log from '../../util/log';

export class AssetCopier implements Renderer {

    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: RenderDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    getItemRenderer(inputGraph: Graph, outputGraph: Graph, context: RenderContext): (item: GraphItem) => void {
        return (item: GraphItem) => {
            if (item.isDirectory)
            {
                return;
            }
            const fullOutPath = path.resolve(config.outDir);
            const outputPath = path.join(fullOutPath, item.relativePath);
            const outputItem = new GraphItem(
                outputPath,
                fullOutPath,
                item.isFile, 
                item.isDirectory, 
                [...item.items],
            );
            outputItem.getContents = () => {
                return outputItem._readContents(item.absolutePath);
            };
            outputGraph.add(outputItem);
        };
    }

    run(inputGraph: Graph, outputGraph: Graph, context: RenderContext) {
        inputGraph.filter(this.filter).visit(this.getItemRenderer(inputGraph, outputGraph, context.clone()))
    }
}
