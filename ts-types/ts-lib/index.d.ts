declare const ts0NotSet: unique symbol;
export { ts0NotSet };
declare const types_TNotNull: unique symbol;
declare const types_TNull: unique symbol;
declare const types_TRawObject: unique symbol;
export declare class ts0_Class {
    #private;
    TArray(itemType: TS0ValueType): Array_Type;
    TDefault(defaultValue: any): Default_Type;
    TEnum(values: Array<any>): Enum_Type;
    TIterable(itemType: TS0ValueType): Iterable_Type;
    get TNotNull(): typeof types_TNotNull;
    get TNull(): typeof types_TNull;
    TObject(keyType: TS0ValueType, valueType: TS0ValueType): Object_Type;
    TPreset(presets: PresetType, hasExtras?: boolean): Preset_Type;
    TPresetArray(presets: Array<TS0ValueType>): PresetArray_Type;
    get TRawObject(): typeof types_TRawObject;
    get notSet(): typeof ts0NotSet;
    constructor();
    assertType(value: any, valueType: TS0ValueType, extraErrorInfo?: string | null): any;
    checkType(value: any, valueType: TS0ValueType, errors?: Array<string>): boolean;
    rtn(valueType: TS0ValueType, value: any): any;
    rtnFn(valueType: TS0ValueType, valueFn?: ((...args: Array<any>) => any) | Symbol): any;
}
declare const ts0: ts0_Class;
export default ts0;
declare class Array_Type {
    #private;
    get itemType(): TS0ValueType;
    constructor(itemType: TS0ValueType);
}
declare class Default_Type {
    #private;
    get defaultValue(): any;
    constructor(defaultValue?: undefined);
}
declare class Enum_Type {
    #private;
    get values(): Array<any>;
    constructor(values: Array<any>);
}
declare class Iterable_Type {
    #private;
    get itemType(): TS0ValueType;
    constructor(itemType: TS0ValueType);
}
declare class Object_Type {
    #private;
    get itemType(): TS0ValueType;
    get keyType(): TS0ValueType;
    constructor(keyType: TS0ValueType, itemType: TS0ValueType);
}
declare class Preset_Type {
    #private;
    get hasExtras(): boolean;
    get presets(): PresetType;
    constructor(presets: PresetType, hasExtras?: boolean);
}
declare class PresetArray_Type {
    #private;
    get presets(): Array<TS0ValueType>;
    constructor(presets: Array<TS0ValueType>);
}
export type TS0ValueType = "boolean" | "function" | "number" | "string" | "undefined" | "bigint" | "bool" | "finite" | "int" | "nan" | "void" | Function | Symbol | typeof Default_Type | typeof Iterable_Type | Array_Type | Default_Type | Enum_Type | Iterable_Type | Object_Type | Preset_Type | PresetArray_Type | Array<TS0ValueType>;
type PresetType = {
    [key: string]: TS0ValueType;
};
