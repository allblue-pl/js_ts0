import type ts0 from "./ts0.ts";

const ts0NotSet = Symbol("ts0_NotSet");
export { ts0NotSet };

export type TS0NotSet = typeof ts0NotSet;
export type TS0RawArray = Array<TS0RawValue>;
export type TS0RawObject = {[key:string|number]: TS0RawValue};
export type TS0RawValue = boolean|null|number|string|TS0RawArray|TS0RawObject;