import TS0AssertError from "./TS0AssertError.ts";
import AssertError from "./TS0AssertError.ts";
import TS0NotImplementedError from "./TS0NotImplementedError.ts";
import TS0TypeError from "./TS0TypeError.ts";
import { ts0NotSet, type TS0NotSet, type TS0RawArray, type TS0RawObject } from "./ts-types.ts";

const args_Extra = Symbol("ts0_ExtraArgs");

const types_TNotNull = Symbol("ts0_TNotNull");
const types_TNull = Symbol("ts0_TNull");
const types_TRawObject = Symbol("ts0_TRawObject");

export class ts0_Class {
    #debug: boolean;
    #types_BasicSet: Set<string>;
    #types_ExtendedSet: Set<string>;


    get debug(): boolean {
        return this.#debug;
    }


    /* Args */
    get AExtra(): typeof args_Extra {
        return args_Extra;
    }

    /* Types */
    TArray(itemType: TS0ValueType, deepCheck: boolean = true): TS0ArrayType {
        return new TS0ArrayType(itemType, deepCheck);
    }

    get TBigInt(): "bigint" {
        return "bigint";
    }

    get TDefault(): typeof ts0DefaultType {
        return ts0DefaultType;
    }

    TEnum(values: Array<any>): TS0EnumType {
        return new TS0EnumType(values);
    }

    get TInt(): "int" {
        return "int";
    }

    get TFinite(): string {
        return "finite";
    }

    TIterable(itemType: TS0ValueType): TS0IterableType {
        return new TS0IterableType(itemType);
    }

    TMap(keyType: TS0ValueType, itemType: TS0ValueType): TS0MapType {
        return new TS0MapType(keyType, itemType);
    }

    get TNotNull(): typeof types_TNotNull {
        return types_TNotNull;
    }

    get TNull(): typeof types_TNull {
        return types_TNull;
    }

    get TNan(): "nan" {
        return "nan";
    }

    TObject(keyType: TS0ValueType, valueType: TS0ValueType): TS0ObjectType {
        return new TS0ObjectType(keyType, valueType);
    }

    TPreset(presets: TS0Preset, extras: TS0PresetType|TS0ObjectType|null = null): 
            TS0PresetType {
        return new TS0PresetType(presets, extras);
    }

    TPresetArray(presets: Array<TS0ValueType>): TS0PresetArrayType {
        return new TS0PresetArrayType(presets);
    }

    get TRawValue(): TS0ValueType {
        return [ "boolean", this.TNull, "number", "string", 
                this.TArray(this.TValueType(() => this.TRawValue)), 
                this.TRawObject ];
    }

    get TRawObject(): typeof types_TRawObject {
        return types_TRawObject;
    }

    TValueType(valueTypeFn: () => TS0ValueType): TS0ValueTypeType {
        return new TS0ValueTypeType(valueTypeFn);
    }

    get TVoid(): "undefined" {
        return "undefined";
    }
    /* / Types */


    get notSet(): TS0NotSet {
        return ts0NotSet;
    }

    constructor() {
        this.#debug = false;

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


    args(args: IArguments, ...types: Array<TS0ValueType>): void {
        if (types[types.length - 1] === this.AExtra) 
            types.pop();
        else {
            if (args.length > types.length) {
                console.warn(new Error());
                throw new Error('Too many arguments in function.');
            }
        }

        for (let i = 0; i < types.length; i++) {
            try {
                let errors: Array<string> = [];
                if (!this.checkType(args[i], types[i], errors, true)) {
                    console.error(`Error: Argument ${i} -> `, errors);
                    console.warn(new Error());
                    throw new TS0TypeError('Wrong argument type.');
                }
            } catch (err) {
                throw new Error(`Error thrown for argument ${i} -> ` + 
                        (err as Error).message);
            }
        }
    }

    assertType<AssertedType>(value: any, valueType: TS0ValueType, extraErrorInfo: 
            string|null = null): AssertedType {
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

    checkArgs(args: IArguments, ...types: Array<TS0ValueType>): Array<string>|null {
        let errors: Array<string> = [];
        let valid = true;
        for (let i = 0; i < types.length; i++) {
            if (!this.checkType(args[i], types[i], errors))
                valid = false;
        }

        return valid ? null : errors;
    }

    checkType(value: any, valueType: TS0ValueType, errors: Array<string> = [],
            argsCheck: boolean = false): boolean {
        if (valueType instanceof TS0ValueTypeType)
            valueType = valueType.valueTypeFn();

        let typeofValue = typeof value;
         
        if (valueType === null) {
            if (argsCheck && typeofValue === 'undefined') {
                errors.push('Arg not set.');
                return false;
            }

            return true;
        }

        if (valueType === this.TDefault) {
            if (typeof value === 'undefined')
                return true;

            return false;
        } else if (valueType === TS0IterableType) {
            if (value === null || typeof value !== 'object') {                
                errors.push(`\`${value}\` is not \`Iterable\`.`);
                return false;
            }

            if (typeof value[Symbol.iterator] !== 'function') {
                errors.push(`\`${value}\` is not \`Iterable\`.`);
                return false;
            }

            return true;
        } else if (valueType === TS0MapType) {
            if (value === null || typeof value !== 'object') {                
                errors.push(`\`${value}\` is not \`Map\`.`);
                return false;
            }

            if (typeof value[Symbol.iterator] !== 'function') {
                errors.push(`\`${value}\` is not \`Map\`.`);
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
        } else if (valueType instanceof TS0ArrayType) {
            if (!this.checkType(value, Array)) {
                errors.push(`Value must be an instance of Array. Found: ${typeofValue}.`);
                return false;
            }

            if (valueType.itemType === null)
                return true;

            let valid = true;
            let i = 0;
            for (let itemValue of value) {
                let itemErrors: Array<string> = [];
                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    let itemKey = value.keys()[i];
                    valid = false;
                    errors.push(`Item '${i}' errors: ` + itemErrors.join(', '));
                }

                if (!valueType.deepCheck)
                    break;

                i++;
            }

            return valid;
        } else if (valueType instanceof TS0EnumType) {
            for (let value_Enum of valueType.values) {
                if (value === value_Enum)
                    return true;
            }

            errors.push(`Enum value '${value}' not found in '` + 
                    valueType.values.join(', ') + `'.`);
            return false;
        } else if (valueType instanceof TS0DefaultType_Info) {
            return false;
        } else if (valueType instanceof TS0IterableType) {
            if (!this.checkType(value, TS0IterableType)) {
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
        } else if (valueType instanceof TS0MapType) {
            if (!this.checkType(value, TS0MapType)) {
                errors.push(`Preset must be Map. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            for (let [ itemKey, itemValue ] of value) {
                let itemErrors: Array<string> = [];

                if (!this.checkType(itemKey, valueType.keyType, itemErrors)) {
                    valid = false;
                    errors.push(`Item '${itemKey}' errors: ` + itemErrors.join(', '));
                }

                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    valid = false;
                    errors.push(`Item '${itemKey}' errors: ` + itemErrors.join(', '));
                }
            }

            return valid;
        } else if (valueType instanceof TS0ObjectType) {
            if (!this.checkType(value, this.TRawObject)) {
                errors.push(`Value must be an instance of RawObject. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;
            for (let itemKey in value) {
                let keyErrors: Array<string> = [];
                if (!this.checkType(itemKey, valueType.keyType, keyErrors)) {
                    valid = false;
                    errors.push(`Key '${itemKey}' -> ` + keyErrors.join(', '));
                }

                let itemErrors: Array<string> = [];
                let itemValue = value[itemKey];
                if (!this.checkType(itemValue, valueType.itemType, itemErrors)) {
                    valid = false;
                    errors.push(`Item '${itemKey}' -> ` + itemErrors.join(', '));
                }
            }

            return valid;
        } else if (valueType instanceof TS0PresetType) {
            if (argsCheck) {
                console.warn(new Error());
                throw new Error('Preset type cannot be used in function arguments.');
            }

            if (value === null) {
                errors.push(`Preset cannot be null.`);
                return false;
            }

            if (typeofValue !== 'object') {
                errors.push(`Preset must be an object. Found: ${typeofValue}.`);
                return false;
            }

            let valid = true;

            let extraValues: TS0RawObject = {};
            for (let key in value) {
                if (valueType.extras === null) {
                    if (!(key in valueType.presets)) {
                        errors.push(`Unknown key \`${key}\`.`);
                        valid = false;
                    }
                } else
                    extraValues[key] = value;
            }

            if (valueType.extras !== null) {
                if (!this.checkType(extraValues, valueType.extras, errors))
                    valid = false;
            }

            for (let key in valueType.presets) {
                let newErrors: Array<string> = [];
                
                if (typeof value[key] === 'undefined') {
                    if (valueType.presets[key] instanceof Array) {
                        for (let propValueType of valueType.presets[key]) {
                            if (propValueType instanceof TS0DefaultType_Info)
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
        } else if (valueType instanceof TS0PresetArrayType) {
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
                            if (propValueType instanceof TS0DefaultType_Info)
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
                    case 'bigint':
                        result = Number.isSafeInteger(value);
                        break;
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

    fn(...args: Array<""|TS0ValueType|(() => any)>): any {
        if (args.length === 0)
            throw new Error(`'js0.fn' requires at least return function argument.`);

        let rtnFn = args[args.length - 1];
        ts0.assertType(rtnFn, 'function');
        
        let rtnType = args.length > 1 ? args[args.length - 2] : 'undefined';
        if (rtnType === '' || rtnType === 'void')
            rtnType = 'undefined';

        if (args.length > 2) {
            let fnArgs = [ args[0] ];
            for (let i = 1; i < args.length - 2; i++)
                fnArgs.push(args[i]);

            /* @ts-expect-error */
            ts0.args.apply(this, fnArgs);
        }
        
        /* @ts-expect-error */
        return ts0.rtn(rtnType, rtnFn());
    }

    async fnAsync(...args: Array<""|TS0ValueType|(() => any)>): Promise<any> {
        if (args.length === 0)
            throw new Error(`'js0.fn' requires at least return function argument.`);

        let rtnFn = args[args.length - 1];
        ts0.assertType(rtnFn, 'function');
        
        let rtnType = args.length > 1 ? args[args.length - 2] : 'undefined';
        if (rtnType === '' || rtnType === 'void')
            rtnType = 'undefined';

        if (args.length > 2) {
            let fnArgs = [ args[0] ];
            for (let i = 1; i < args.length - 2; i++)
                fnArgs.push(args[i]);

            /* @ts-expect-error */
            ts0.args.apply(this, fnArgs);
        }
        
        /* @ts-expect-error */
        return ts0.rtn(rtnType, await rtnFn());
    }

    rtn<ReturnType>(valueType: TS0ValueType, value: any): ReturnType {
        return this.assertType<ReturnType>(value, valueType, 
                "Wrong return value.");
    }

    rtnFn<ReturnType>(valueType: TS0ValueType, valueFn: 
            ((...args: Array<any>) => ReturnType)|Symbol = this.notSet): 
            ReturnType|Promise<ReturnType> {
        if (typeof valueFn === 'function') {
            let value = valueFn();
            if (value instanceof Promise) {
                return value
                    .then((resultValue) => {
                        return this.assertType<ReturnType>(resultValue, valueType);
                    });
            }

            return this.assertType<ReturnType>(value, valueType);
        }

        throw new Error(`'valueFn' is not a function.`);
    }

    setDebug(debug: boolean): void {    
        this.#debug = debug;
    }

    validateType<AssertedType>(value: any, valueType: TS0ValueType, 
            errors: Array<string> = []): AssertedType|undefined {
        if (this.checkType(value, valueType, errors))
            return value as AssertedType;
        
        return undefined;
    }
}
const ts0 = new ts0_Class();
export default ts0;


export class TS0AndType  {
    #valueTypes: Array<TS0ValueType>;

    get valueTypes(): Array<TS0ValueType> {
        return this.#valueTypes;
    }

    constructor(valueTypes: Array<TS0ValueType>) {
        this.#valueTypes = valueTypes;
    }
}

export class TS0ArrayType {
    #deepCheck: boolean;
    #itemType: TS0ValueType;

    get deepCheck(): boolean {
        return this.#deepCheck;
    }

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    constructor(itemType: TS0ValueType, deepCheck: boolean) {
        this.#deepCheck = deepCheck;
        this.#itemType = itemType;
    }
}

export class TS0DefaultType_Info {
    #defaultValue: any;

    get defaultValue(): any {
        return this.#defaultValue;
    }

    constructor(defaultValue: any) {
        this.#defaultValue = defaultValue;
    }
}

function ts0DefaultType(defaultValue: any): TS0DefaultType_Info {
    return new TS0DefaultType_Info(defaultValue);
}

export class TS0EnumType {
    #values: Array<any>;

    get values(): Array<any> {
        return this.#values;
    }

    constructor(values: Array<any>) {
        this.#values = values;
    }
}

export class TS0IterableType {
    #itemType: TS0ValueType;

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    constructor(itemType: TS0ValueType) {
        this.#itemType = itemType;
    }
}

export class TS0MapType {
    #keyType: TS0ValueType;
    #itemType: TS0ValueType;

    get keyType(): TS0ValueType {
        return this.#keyType;
    }

    get itemType(): TS0ValueType {
        return this.#itemType;
    }

    constructor(keyType: TS0ValueType, itemType: TS0ValueType) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

export class TS0ObjectType {
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

export class TS0PresetType {
    #presets: TS0Preset;
    #extras: TS0PresetType|TS0ObjectType|null;

    get extras(): TS0PresetType|TS0ObjectType|null {
        return this.#extras;
    }

    get presets(): TS0Preset {
        return this.#presets;
    }

    constructor(presets: TS0Preset, extras: TS0PresetType|TS0ObjectType|null = null) {
        this.#presets = presets;
        this.#extras = extras;
    }
}

export class TS0PresetArrayType {
    #presets: Array<TS0ValueType>;

    get presets(): Array<TS0ValueType> {
        return this.#presets;
    }

    constructor(presets: Array<TS0ValueType>) {
        this.#presets = presets;
    }
}

export class TS0ValueTypeType {
    #valueTypeFn: () => TS0ValueType;

    get valueTypeFn(): () => TS0ValueType {
        return this.#valueTypeFn;
    }

    constructor(valueTypeFn: () => TS0ValueType) {
        this.#valueTypeFn = valueTypeFn;
    }
}

export type TS0ValueType = null|
        "undefined"|"boolean"|"function"|"number"|"object"|"string"|
        "bigint"|"bool"|"finite"|"int"|"nan"|"void"|
        Function|
        Symbol|typeof ts0DefaultType|typeof TS0IterableType|
        TS0ArrayType|TS0DefaultType_Info|TS0EnumType|TS0IterableType|TS0MapType|TS0ObjectType|
        TS0PresetType|TS0PresetArrayType|TS0ValueTypeType|Array<TS0ValueType>;
export type TS0Preset = {[key:string]: TS0ValueType};