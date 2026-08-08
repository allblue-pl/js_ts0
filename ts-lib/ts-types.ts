import type ts0 from "./index.ts";

const ts0NotSet = Symbol("ts0_NotSet");
export { ts0NotSet };

export type TS0NotSet = typeof ts0NotSet;
export type TS0RawArray = Array<boolean|null|number|string|TS0RawArray|TS0RawObject>;
export type TS0RawObject = {[key:string|number]: boolean|null|number|string|TS0RawArray|TS0RawObject};
export type TS0RawValue = boolean|null|number|string|TS0RawArray|TS0RawObject;