import type ts0 from "./ts0.ts";

const ts0NotSet = Symbol("ts0_NotSet");
export { ts0NotSet };

export type TS0NotSet = typeof ts0NotSet;
export type TS0RawArray = Array<TS0RawValue>;
export type TS0RawObject = {[key:string|number]: TS0RawValue};
export type TS0RawValue = boolean|null|number|string|TS0RawArray|TS0RawObject;

export type TS0OptionalRequiredArray<T> = Array<TS0OptionalRequiredObject<T>>;
export type TS0OptionalRequiredObject<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends Function
        ? NonNullable<T[K]>
        : NonNullable<T[K]> extends Array<infer U>
        ? TS0OptionalRequiredArray<U>
        : NonNullable<T[K]> extends Map<infer MK, infer MV>
        ? Map<MK, TS0OptionalRequiredObject<MV>>
        : NonNullable<T[K]> extends ReadonlyMap<infer MK, infer MV>
        ? ReadonlyMap<MK, TS0OptionalRequiredObject<MV>>
        : NonNullable<T[K]> extends Set<infer SV>
        ? Set<TS0OptionalRequiredObject<SV>>
        : NonNullable<T[K]> extends ReadonlySet<infer SV> 
        ? ReadonlySet<TS0OptionalRequiredObject<SV>>
        : NonNullable<T[K]> extends new (...args: any[]) => any
        ? NonNullable<T[K]>
        : NonNullable<T[K]> extends object
        ? TS0OptionalRequiredObject<NonNullable<T[K]>>
        : NonNullable<T[K]>;
} & {};

export type TS0OptionalRemovedObject<T> = T extends object
    ? T extends (...args: any[]) => any
        ? T
        : {
            [K in keyof T as {} extends Pick<T, K> ? never : K]-?: TS0OptionalRemovedObject<T[K]>;
        }
    : T;