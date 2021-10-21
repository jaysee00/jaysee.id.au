import * as fs from 'fs-extra';
import * as path from 'path';

export class GraphItem {
    fileName: string;

    constructor(absolutePath: string, rootPath: string) {
        this.fileName = path.basename(absolutePath);


    }
}
// export class GraphItem {
//     fileName: string
//     extension: string,
//     absolutePath: string,
//     isFile: boolean,
//     isDirectory: boolean,
//     items: GraphItem[] | null,
//     getContents: () => Buffer

//     constructor(fs.)
// }

// export class Graph {
//     items: GraphItem[];

//     constructor(...args: []) {
//         this.items = new Array<GraphItem>();
//     }

// }





// export interface Preprocessor {
//     process: (arg0: Graph) => void
// }
