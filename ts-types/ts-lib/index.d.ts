import { type TS0NotSet } from "./ts-types.ts";
declare const args_Extra: unique symbol;
declare const types_TNotNull: unique symbol;
declare const types_TNull: unique symbol;
declare const types_TRawObject: unique symbol;
export declare class ts0_Class {
    #private;
    get debug(): boolean;
    get AExtra(): typeof args_Extra;
    TArray(itemType: TS0ValueType, deepCheck?: boolean): TS0ArrayType;
    get TBigInt(): "bigint";
    get TDefault(): typeof ts0DefaultType;
    TEnum(values: Array<any>): TS0EnumType;
    get TInt(): "int";
    get TFinite(): string;
    TIterable(itemType: TS0ValueType): TS0IterableType;
    TMap(keyType: TS0ValueType, itemType: TS0ValueType): TS0MapType;
    get TNotNull(): typeof types_TNotNull;
    get TNull(): typeof types_TNull;
    get TNan(): "nan";
    TObject(keyType: TS0ValueType, valueType: TS0ValueType): TS0ObjectType;
    TPreset(presets: TS0Preset, extras?: TS0PresetType | TS0ObjectType | null): TS0PresetType;
    TPresetArray(presets: Array<TS0ValueType>): TS0PresetArrayType;
    get TRawValue(): TS0ValueType;
    get TRawObject(): typeof types_TRawObject;
    TValueType(valueTypeFn: () => TS0ValueType): TS0ValueTypeType;
    get TVoid(): "undefined";
    get notSet(): TS0NotSet;
    constructor();
    args(args: IArguments, ...types: Array<TS0ValueType>): void;
    assertType<AssertedType>(value: any, valueType: TS0ValueType, extraErrorInfo?: string | null): AssertedType;
    checkArgs(args: IArguments, ...types: Array<TS0ValueType>): Array<string> | null;
    checkType(value: any, valueType: TS0ValueType, errors?: Array<string>, argsCheck?: boolean): boolean;
    fn(...args: Array<"" | TS0ValueType | (() => any)>): any;
    fnAsync(...args: Array<"" | TS0ValueType | (() => any)>): Promise<any>;
    rtn<ReturnType>(valueType: TS0ValueType, value: any): ReturnType;
    rtnFn<ReturnType>(valueType: TS0ValueType, valueFn?: ((...args: Array<any>) => ReturnType) | Symbol): ReturnType | Promise<ReturnType>;
    setDebug(debug: boolean): void;
    validateType<AssertedType>(value: any, valueType: TS0ValueType, errors?: Array<string>): AssertedType | undefined;
}
declare const ts0: ts0_Class;
export default ts0;
export declare class TS0AndType {
    #private;
    get valueTypes(): Array<TS0ValueType>;
    constructor(valueTypes: Array<TS0ValueType>);
}
export declare class TS0ArrayType {
    #private;
    get deepCheck(): boolean;
    get itemType(): TS0ValueType;
    constructor(itemType: TS0ValueType, deepCheck: boolean);
}
export declare class TS0DefaultType_Info {
    #private;
    get defaultValue(): any;
    constructor(defaultValue: any);
}
declare function ts0DefaultType(defaultValue: any): TS0DefaultType_Info;
export declare class TS0EnumType {
    #private;
    get values(): Array<any>;
    constructor(values: Array<any>);
}
export declare class TS0IterableType {
    #private;
    get itemType(): TS0ValueType;
    constructor(itemType: TS0ValueType);
}
export declare class TS0MapType {
    #private;
    get keyType(): TS0ValueType;
    get itemType(): TS0ValueType;
    constructor(keyType: TS0ValueType, itemType: TS0ValueType);
}
export declare class TS0ObjectType {
    #private;
    get itemType(): TS0ValueType;
    get keyType(): TS0ValueType;
    constructor(keyType: TS0ValueType, itemType: TS0ValueType);
}
export declare class TS0PresetType {
    #private;
    get extras(): TS0PresetType | TS0ObjectType | null;
    get presets(): TS0Preset;
    constructor(presets: TS0Preset, extras?: TS0PresetType | TS0ObjectType | null);
}
export declare class TS0PresetArrayType {
    #private;
    get presets(): Array<TS0ValueType>;
    constructor(presets: Array<TS0ValueType>);
}
export declare class TS0ValueTypeType {
    #private;
    get valueTypeFn(): () => TS0ValueType;
    constructor(valueTypeFn: () => TS0ValueType);
}
export type TS0ValueType = null | "undefined" | "boolean" | "function" | "number" | "object" | "string" | "bigint" | "bool" | "finite" | "int" | "nan" | "void" | Function | Symbol | typeof ts0DefaultType | typeof TS0IterableType | TS0ArrayType | TS0DefaultType_Info | TS0EnumType | TS0IterableType | TS0MapType | TS0ObjectType | TS0PresetType | TS0PresetArrayType | TS0ValueTypeType | Array<TS0ValueType>;
export type TS0Preset = {
    [key: string]: TS0ValueType;
};
