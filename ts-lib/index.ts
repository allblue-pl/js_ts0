import AssertError from "./TS0AssertError.ts";
import type { TS0RawArray, TS0RawObject } from "./ts-types.ts";

const ts0NotSet = Symbol("ts0_NotSet");
export { ts0NotSet };

const types_TNotNull = Symbol("ts0_TNotNull");
const types_TNull = Symbol("ts0_TNull");
const types_TRawObject = Symbol("ts0_TRawObject");

export class ts0_Class {
    #types_BasicSet: Set<string>;
    #types_ExtendedSet: Set<string>;

    /* Types */
    TArray(itemType: TS0ValueType): Array_Type {
        return new Array_Type(itemType);
    }

    TDefault(defaultValue: any): Default_Type {
        return new Default_Type(defaultValue);
    }

    TEnum(values: Array<any>): Enum_Type {
        return new Enum_Type(values);
    }

    TIterable(itemType: TS0ValueType): Iterable_Type {
        return new Iterable_Type(itemType);
    }

    get TNotNull(): typeof types_TNotNull {
        return types_TNotNull;
    }

    get TNull(): typeof types_TNull {
        return types_TNull;
    }

    TObject(keyType: TS0ValueType, valueType: TS0ValueType): Object_Type {
        return new Object_Type(keyType, valueType);
    }

    TPreset(presets: PresetType, hasExtras: boolean = false): Preset_Type {
        return new Preset_Type(presets, hasExtras);
    }

    TPresetArray(presets: Array<TS0ValueType>): PresetArray_Type {
        return new PresetArray_Type(presets);
    }

    get TRawObject(): typeof types_TRawObject {
        return types_TRawObject;
    }
    /* / Types */


    get notSet(): typeof ts0NotSet {
        return ts0NotSet;
    }

    constructor() {
        this.#types_BasicSet = new Set([
            'undefined',
            // 'object', /* null */
            'boolean',
            'number',
            'string',
            'symbol',
            'function',
            'object'
        ]);

        this.#types_ExtendedSet = new Set([
            'bigint',
            'bool',
            'finite',
            'int',
            'nan',
            'void'
        ]);
    }


    assertType(value: any, valueType: TS0ValueType, extraErrorInfo: string|null = null): any {
        let errors: Array<string> = [];
        if (this.checkType(value, valueType, errors))
            return value;

        if (extraErrorInfo !== null)
            errors.splice(0, 0, extraErrorInfo);

        console.error('Asserted Value:', value);
        console.error('Error:', errors);
        console.warn((new Error()).stack);
        throw new TS0TypeError('Wrong variable type.');
    }

    checkType(value: any, valueType: TS0ValueType, errors: Array<string> = []): boolean {
        let typeofValue = typeof value;

        if (valueType === Default_Type) {
            if (typeof value === 'undefined')
                return true;

            return false;
        } else if (valueType === Iterable_Type) {
            if (value === null || typeof value !== 'object') {                
                errors.push(`\`${value}\` is not \`Iterable\`.`);
                return false;
            }

            if (typeof value[Symbol.iterator] !== 'function') {
                errors.push(`\`${value}\` is not \`Iterable\`.`);
                return false;
            }

            return true;
        } else if (valueType === this.TRawObject) {
            if (value === null) {
                errors.push(`RawObject cannot be \`null\`.`);
                return false;
            }

            if (typeofValue === 'undefined') {
                errors.push(`'${value}' is not an RawObject.`);
                return false;
            }

            if (Object.getPrototypeOf(value) !== Object.prototype) {
                errors.push(`'${value}' is not an RawObject.`);
                return false;
            }

            return true;
        } else if (valueType === this.TNotNull) {
            if (value === null) {
                errors.push(`\`${value}\` cannot be \`null\`.`);
                return false;
            }

            return true;
        } else if (valueType === this.TNull) {
            if (value === null)
                return true;

            return false;
        } else if (valueType instanceof Array_Type) {
            if (!this.checkType(value, Array)) {
                errors.push(`Value must be an instance of Array. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            let i = 0;
            for (let itemValue of value) {
                let itemErrors: Array<string> = [];
                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    let itemKey = value.keys()[i];
                    valid = false;
                    errors.push(`Item '${i}' errors: ` + itemErrors.join(', '));
                }
                i++;
            }

            return valid;
        } else if (valueType instanceof Enum_Type) {
            for (let value_Enum of valueType.values) {
                if (value === value_Enum)
                    return true;
            }

            errors.push(`Enum value '${value}' not found in '` + 
                    valueType.values.join(', ') + `'.`);
            return false;
        } else if (valueType instanceof Default_Type) {
            return false;
        } else if (valueType instanceof Iterable_Type) {
            if (!this.checkType(value, Iterable_Type)) {
                errors.push(`Preset must be Iterable. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            for (let i = 0; i < value.length; i++) {
                let itemValue = value[i];
                let itemErrors: Array<string> = [];
                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    valid = false;
                    errors.push(`Item '${i}' errors: ` + itemErrors.join(', '));
                }
            }

            return valid;
        } else if (valueType instanceof Object_Type) {
            if (!this.checkType(value, this.TRawObject)) {
                errors.push(`Value must be an instance of RawObject. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            for (let itemKey in value) {
                let keyErrors: Array<string> = [];
                if (!this.checkType(itemKey, valueType.keyType, keyErrors)) {
                    valid = false;
                    errors.push(`Key '${itemKey}' errors: ` + keyErrors.join(', '));
                }

                let itemErrors: Array<string> = [];
                let itemValue = value[itemKey];
                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    valid = false;
                    errors.push(`Item '${itemKey}' errors: ` + itemErrors.join(', '));
                }
            }

            return valid;
        } else if (valueType instanceof Preset_Type) {
            if (value === null) {
                errors.push(`Preset cannot be null.`);
                return false;
            }

            if (typeofValue !== 'object') {
                errors.push(`Preset must be an object. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;

            if (!valueType.hasExtras) {
                for (let key in value) {
                    if (!(key in valueType.presets)) {
                        errors.push(`Unknown key \`${key}\`.`);
                        valid = false;
                    }
                }
            }

            for (let key in valueType.presets) {
                let newErrors: Array<string> = [];
                
                if (typeof value[key] === 'undefined') {
                    if (valueType.presets[key] instanceof Array) {
                        for (let propValueType of valueType.presets[key]) {
                            if (propValueType instanceof Default_Type)
                                value[key] = propValueType.defaultValue;
                        }
                    }
                }

                try {
                    if (this.checkType(value[key], valueType.presets[key], newErrors))
                        continue;
                } catch (err) {
                    newErrors.push((err as Error).toString());
                }

                for (let newError of newErrors)
                    errors.push(`${key} -> ${newError}`);

                valid = false;
            }

            // console.log('WTF', value, valid, errors);

            return valid;
        } else if (valueType instanceof PresetArray_Type) {
            // if (typeofValue === 'undefined' && typeof 
            //         valueType.defaultValue !== 'undefined') {
            //     value = valueType.defaultValue;
            //     typeofValue = typeof value;
            // }

            if (value === null) {
                errors.push(`Preset cannot be null.`);
                return false;
            }

            if (!(value instanceof Array)) {
                errors.push(`PresetArray must be an array. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            
            if (value.length !== valueType.presets.length) {
                errors.push(`Wrong PresetArray length. Required: '${valueType.presets.length}'.`);
                    valid = false;
            }

            for (let i = 0; i < valueType.presets.length; i++) {
                let newErrors: Array<string> = [];
                
                if (typeof value[i] === 'undefined') {
                    if (valueType.presets[i] instanceof Array) {
                        for (let propValueType of (valueType.presets[i] as Array<TS0ValueType>)) {
                            if (propValueType instanceof Default_Type)
                                value[i] = propValueType.defaultValue;
                        }
                    }
                }

                if (this.checkType(value[i], valueType.presets[i], newErrors))
                    continue;

                for (let newError of newErrors)
                    errors.push(`${i} -> ${newError}`);

                valid = false;
            }

            return valid;
        }

        let typeofValueType = typeof valueType;

        /* Basic Types */
        if (typeofValueType === 'string') {
            let result = true;
            if (this.#types_BasicSet.has(valueType as string)) {
                result = typeof value === valueType;
            } else if (this.#types_ExtendedSet.has(valueType as string)) {
                switch(valueType) {
                    case 'bool':
                        result = typeofValue === 'boolean';
                        break;
                    case 'int':
                        result = Number.isInteger(value);
                        break;
                    case 'finite':
                        result = Number.isFinite(value);
                        break;
                    case 'nan':
                        result = Number.isNaN(value);
                        break;
                    case 'void':
                        result = typeofValue === 'undefined';
                        break;
                }
            } else {
                errors.push(`Unknown type '${valueType}'.`);
                return false;
            }

            if (!result) {
                let typeof_value = typeof value;
                let value_Str = String(value);
                errors.push(`Variable \`${value_Str}\` of type \`${typeof_value}\`` +
                    ` should be of type \`${valueType}\`.`);
                return false;
            }

            return true;
        }

        if (typeofValueType === 'object') {
            /* Multiple Types */
            if (valueType instanceof Array) {
                if (value === null) {
                    for (let i = 0; i < valueType.length; i++) {
                        if (valueType[i] === this.TNotNull) {
                            errors.push(`\`${value}\` cannot be \`null\`.`);
                            return false;
                        }
                    }
                }

                for (let i = 0; i < valueType.length; i++) {
                    if (this.checkType(value, valueType[i], errors))
                        return true;
                }

                return false;
            }

            console.warn((new Error()).stack);
            console.warn('Value type: ', valueType);
            throw new Error(`Unknown 'valueType': ${typeofValueType}`);
        }

        if (typeofValueType === 'function') {
            // /* Property */
            // if ('Property' in valueType) {
            //     if (!this.implements(value, valueType)) {
            //
            //         errors.push(`Variable does not implement property
            //                 \`${valueType.constructor}\`.`);
            //         return false;
            //     }
            //
            //     return true;
            // }

            /* Class */
            if (!(value instanceof (valueType as Function))) {
                let valueStr = String(value);
                errors.push(`Variable \`${valueStr}\` is not an instance of` +
                        ` \`${(valueType as Function).name}\`.`);
                return false;
            }

            return true;
        }

        if (typeofValueType === 'symbol') {
            if (value !== valueType) {
                let value_Str = String(value);
                let valueType_Str = String(valueType);
                errors.push(`Variable '${value_Str}' is not ${valueType_Str}.`);
                return false;
            }

            return true;
        }

        console.warn((new Error()).stack);
        throw new Error(`Unknown 'valueType': ${typeofValueType}`);
    }

    rtn(valueType: TS0ValueType, value: any): any {
        this.assertType(value, valueType, "Wrong return value.");
        return value;
    }

    rtnFn(valueType: TS0ValueType, valueFn: ((...args: Array<any>) => any)|Symbol = 
            this.notSet): any {
        if (typeof valueFn === 'function') {
            let value = valueFn();
            if (value instanceof Promise) {
                return value
                    .then((resultValue) => {
                        this.assertType(resultValue, valueType);
                        return value;
                    });
            }

            this.assertType(value, valueType);
            return value;
        }

        throw new Error(`'valueFn' is not a function.`);
    }
}
const ts0 = new ts0_Class();
export default ts0;


class And_Type  {
    #valueTypes: Array<TS0ValueType>;

    get valueTypes(): Array<TS0ValueType> {
        return this.#valueTypes;
    }

    constructor(valueTypes: Array<TS0ValueType>) {
        this.#valueTypes = valueTypes;
    }
}

class Array_Type {
    #itemType: TS0ValueType;

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    constructor(itemType: TS0ValueType) {
        this.#itemType = itemType;
    }
}

class Default_Type {
    #defaultValue: any;

    get defaultValue(): any {
        return this.#defaultValue;
    }

    constructor(defaultValue = undefined) {
        this.#defaultValue = defaultValue;
    }
}

class Enum_Type {
    #values: Array<any>;

    get values(): Array<any> {
        return this.#values;
    }

    constructor(values: Array<any>) {
        this.#values = values;
    }
}

class Iterable_Type {
    #itemType: TS0ValueType;

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    constructor(itemType: TS0ValueType) {
        this.#itemType = itemType;
    }
}

class Object_Type {
    #keyType: TS0ValueType;
    #itemType: TS0ValueType;

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    get keyType(): TS0ValueType {
        return this.#keyType;
    }

    constructor(keyType: TS0ValueType, itemType: TS0ValueType) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

    // Or_Type: { value:
    // class ts0_Or_Type
    // {
    //     constructor(propClass)
    //     {
    //         js0.argsE(arguments, js0.PropClass);
    //
    //         Object.defineProperties(this, {
    //             _propClass: { value: propClass, },
    //         });
    //     }
    // }},

class Preset_Type {
    #presets: PresetType;
    #hasExtras: boolean;

    get hasExtras(): boolean {
        return this.#hasExtras;
    }

    get presets(): PresetType {
        return this.#presets;
    }

    constructor(presets: PresetType, hasExtras: boolean = false) {
        this.#presets = presets;
        this.#hasExtras = hasExtras;
    }
}

class PresetArray_Type {
    #presets: Array<TS0ValueType>;

    get presets(): Array<TS0ValueType> {
        return this.#presets;
    }

    constructor(presets: Array<TS0ValueType>) {
        this.#presets = presets;
    }
}

class TS0TypeError extends Error {
    constructor(message: string) {
        super(message);

        // let stack = this.stack;
        // let stack_array = stack.split('\n');
        // stack_array.splice(1, 3);
        // this.stack = stack_array.join('\n');
    }
}


export type TS0ValueType = 
        "boolean"|"function"|"number"|"string"|"undefined"|
        "bigint"|"bool"|"finite"|"int"|"nan"|"void"|
        Function|
        Symbol|typeof Default_Type|typeof Iterable_Type|
        Array_Type|Default_Type|Enum_Type|Iterable_Type|Object_Type|Preset_Type|
        PresetArray_Type|Array<TS0ValueType>;
type PresetType = {[key:string]: TS0ValueType};