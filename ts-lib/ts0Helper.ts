import type { TS0RawArray, TS0RawObject } from "./ts-types.ts";
import ts0, { type TS0ValueType } from "./ts0.ts";

export class ts0Helper_Class {
    constructor() {
        
    }

    copyRawArray(arr: TS0RawArray): TS0RawArray {
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
                arr_New.push(this.copyRawArray(val));
                continue;
            }

            arr_New.push(val);
        }

        return arr_New;
    }

    copyRawObject<T extends TS0RawObject>(obj: T): T {
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
                obj_New[prop] = this.copyRawArray(obj[prop]);
                continue;
            }

            obj_New[prop] = obj[prop];
        }

        return obj_New as T;
    }
}
const ts0Helper = new ts0Helper_Class();
export default ts0Helper;