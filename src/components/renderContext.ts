import * as log from '../util/log';

export default class RenderContext {

    map = new Map<string, any>();

    constructor(other?: RenderContext) {
        this.map = other ? new Map<string, any>(other.map) : new Map<string, any>();
    }

    /**
     * Returns a string representation of this context for logging & debugging 
     * purposes. `JSON.stringify` does not work well for this class because the 
     * internal implementation is based on the `Map` type.
     */
    toLogString(): string {
        type DebugObj = {
            [Key: string]: any
        }

        const debugObj: DebugObj = {};
        this.map.forEach((val, key) => {
            debugObj[key] = val;
        });

        return JSON.stringify(debugObj);
    }

    hbsIt(): any {
        interface LooseObject {
            [key: string]: any
        }

        const output: LooseObject = {}
        this.map.forEach((val, key) => {
            output[key] = val;
        });
        return output;
    } 

    smoosh(other: RenderContext) {
        const smooshed = new RenderContext();
        smooshed.map = new Map<string, any>([...this.map].concat([...other.map]));
        return smooshed;
    }

    get(key: string) {
        return this.map.get(key);
    }
    
    set(key: string, value: any) {
        this.map.set(key, value);
    }
    
    clone() {
        const clonedMap = new RenderContext(this);
        return clonedMap;
    }
};