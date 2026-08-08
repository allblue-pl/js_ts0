import type { TS0RawArray, TS0RawObject } from "./ts-types.ts";
export declare class ts0Helper_Class {
    constructor();
    copyRawArray(arr: TS0RawArray): TS0RawArray;
    copyRawObject<T extends TS0RawObject>(obj: T): T;
}
declare const ts0Helper: ts0Helper_Class;
export default ts0Helper;
