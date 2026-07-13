import { types } from "node:util";
import type { TS0RawArray, TS0RawObject } from "./ts-types.ts";
import ts0 from "./index.ts";

export class ts0Helper_Class {
    constructor() {
        
    }

    copyArray(arr: TS0RawArray): TS0RawArray {
        let arr_New = new Array();
        for (let val of arr) {
            if (val === null) {
                arr.push(null);
                continue;
            }

            if (ts0.checkType(val, ts0.TRawObject)) {
                arr_New.push(this.copyRawObject(val as TS0RawObject));
                continue;
            }

            if (Array.isArray(val)) {
                arr_New.push(this.copyArray(val));
                continue;
            }

            arr_New.push(val);
        }

        return arr_New;
    }

    copyRawObject(obj: TS0RawObject): TS0RawObject {
        ts0.assertType(obj, ts0.TRawObject);

        let obj_New: TS0RawObject = {};
        for (let prop in obj) {
            if (obj[prop] === null) {
                obj_New[prop] = null;
                continue;
            }

            if ((typeof obj[prop]) === 'symbol') {
                obj_New[prop] = obj[prop];
                continue;
            }

            if (ts0.checkType(obj[prop], ts0.TRawObject)) {
                obj_New[prop] = this.copyRawObject(obj[prop] as TS0RawObject);
                continue;
            }

            if (Array.isArray(obj[prop])) {
                obj_New[prop] = this.copyArray(obj[prop]);
                continue;
            }

            obj_New[prop] = obj[prop];
        }

        return obj_New;
    }
}
const ts0Helper = new ts0Helper_Class();
export default ts0Helper;