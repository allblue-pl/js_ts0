import type { TS0RawObject } from "./ts-types.ts";

export default function ts0IsRawObject(value: any): value is TS0RawObject {
    return typeof value === 'object' && 
            value !== null && 
            !Array.isArray(value) &&
            Object.getPrototypeOf(value) === Object.prototype;
}