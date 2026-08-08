import TS0AssertError from "./TS0AssertError.js";
import AssertError from "./TS0AssertError.js";
import TS0NotImplementedError from "./TS0NotImplementedError.js";
import TS0TypeError from "./TS0TypeError.js";
import { ts0NotSet,                                                     } from "./ts-types.js";

const args_Extra = Symbol("ts0_ExtraArgs");

const types_TNotNull = Symbol("ts0_TNotNull");
const types_TNull = Symbol("ts0_TNull");
const types_TRawObject = Symbol("ts0_TRawObject");

export class ts0_Class {
    #debug         ;
    #types_BasicSet             ;
    #types_ExtendedSet             ;


    get debug()          {
        return this.#debug;
    }


    /* Args */
    get AExtra()                    {
        return args_Extra;
    }

    /* Types */
    TArray(itemType              , deepCheck          = true)               {
        return new TS0ArrayType(itemType, deepCheck);
    }

    get TBigInt()           {
        return "bigint";
    }

    get TDefault()                        {
        return ts0DefaultType;
    }

    TEnum(values            )              {
        return new TS0EnumType(values);
    }

    get TInt()        {
        return "int";
    }

    get TFinite()         {
        return "finite";
    }

    TIterable(itemType              )                  {
        return new TS0IterableType(itemType);
    }

    TMap(keyType              , itemType              )             {
        return new TS0MapType(keyType, itemType);
    }

    get TNotNull()                        {
        return types_TNotNull;
    }

    get TNull()                     {
        return types_TNull;
    }

    get TNan()        {
        return "nan";
    }

    TObject(keyType              , valueType              )                {
        return new TS0ObjectType(keyType, valueType);
    }

    TPreset(presets           , extras                                   = null)  
                          {
        return new TS0PresetType(presets, extras);
    }

    TPresetArray(presets                     )                     {
        return new TS0PresetArrayType(presets);
    }

    get TRawValue()               {
        return [ "boolean", this.TNull, "number", "string", 
                this.TArray(this.TValueType(() => this.TRawValue)), 
                this.TRawObject ];
    }

    get TRawObject()                          {
        return types_TRawObject;
    }

    TValueType(valueTypeFn                    )                   {
        return new TS0ValueTypeType(valueTypeFn);
    }

    get TVoid()              {
        return "undefined";
    }
    /* / Types */


    get notSet()            {
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


    args(args            , ...types                     )       {
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
                let errors                = [];
                if (!this.checkType(args[i], types[i], errors, true)) {
                    console.error(`Error: Argument ${i} -> `, errors);
                    console.warn(new Error());
                    throw new TS0TypeError('Wrong argument type.');
                }
            } catch (err) {
                throw new Error(`Error thrown for argument ${i} -> ` + 
                        (err         ).message);
            }
        }
    }

    assertType              (value     , valueType              , extraErrorInfo  
                        = null)               {
        let errors                = [];
        if (this.checkType(value, valueType, errors))
            return value;

        if (extraErrorInfo !== null)
            errors.splice(0, 0, extraErrorInfo);

        console.error('Asserted Value:', value);
        console.error('Error:', errors);
        console.warn((new Error()).stack);
        throw new TS0TypeError('Wrong variable type.');
    }

    checkArgs(args            , ...types                     )                     {
        let errors                = [];
        let valid = true;
        for (let i = 0; i < types.length; i++) {
            if (!this.checkType(args[i], types[i], errors))
                valid = false;
        }

        return valid ? null : errors;
    }

    checkType(value     , valueType              , errors                = [],
            argsCheck          = false)          {
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
                let itemErrors                = [];
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
                let itemErrors                = [];
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
                let itemErrors                = [];

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
                let keyErrors                = [];
                if (!this.checkType(itemKey, valueType.keyType, keyErrors)) {
                    valid = false;
                    errors.push(`Key '${itemKey}' -> ` + keyErrors.join(', '));
                }

                let itemErrors                = [];
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

            let extraValues               = {};
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
                let newErrors                = [];
                
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
                    newErrors.push((err         ).toString());
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
                let newErrors                = [];
                
                if (typeof value[i] === 'undefined') {
                    if (valueType.presets[i] instanceof Array) {
                        for (let propValueType of (valueType.presets[i]                       )) {
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
            if (this.#types_BasicSet.has(valueType          )) {
                result = typeof value === valueType;
            } else if (this.#types_ExtendedSet.has(valueType          )) {
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
            if (!(value instanceof (valueType            ))) {
                let valueStr = String(value);
                errors.push(`Variable \`${valueStr}\` is not an instance of` +
                        ` \`${(valueType            ).name}\`.`);
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

    fn(...args                                    )      {
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

    async fnAsync(...args                                    )               {
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

    rtn            (valueType              , value     )             {
        return this.assertType            (value, valueType, 
                "Wrong return value.");
    }

    rtnFn            (valueType              , valueFn  
                                                         = this.notSet)  
                                           {
        if (typeof valueFn === 'function') {
            let value = valueFn();
            if (value instanceof Promise) {
                return value
                    .then((resultValue) => {
                        return this.assertType            (resultValue, valueType);
                    });
            }

            return this.assertType            (value, valueType);
        }

        throw new Error(`'valueFn' is not a function.`);
    }

    setDebug(debug         )       {    
        this.#debug = debug;
    }

    validateType              (value     , valueType              , 
            errors                = [])                         {
        if (this.checkType(value, valueType, errors))
            return value                ;
        
        return undefined;
    }
}
const ts0 = new ts0_Class();
export default ts0;


export class TS0AndType  {
    #valueTypes                     ;

    get valueTypes()                      {
        return this.#valueTypes;
    }

    constructor(valueTypes                     ) {
        this.#valueTypes = valueTypes;
    }
}

export class TS0ArrayType {
    #deepCheck         ;
    #itemType              ;

    get deepCheck()          {
        return this.#deepCheck;
    }

    get itemType()               {
        return this.#itemType;
    }

    constructor(itemType              , deepCheck         ) {
        this.#deepCheck = deepCheck;
        this.#itemType = itemType;
    }
}

export class TS0DefaultType_Info {
    #defaultValue     ;

    get defaultValue()      {
        return this.#defaultValue;
    }

    constructor(defaultValue     ) {
        this.#defaultValue = defaultValue;
    }
}

function ts0DefaultType(defaultValue     )                      {
    return new TS0DefaultType_Info(defaultValue);
}

export class TS0EnumType {
    #values            ;

    get values()             {
        return this.#values;
    }

    constructor(values            ) {
        this.#values = values;
    }
}

export class TS0IterableType {
    #itemType              ;

    get itemType()               {
        return this.#itemType;
    }

    constructor(itemType              ) {
        this.#itemType = itemType;
    }
}

export class TS0MapType {
    #keyType              ;
    #itemType              ;

    get keyType()               {
        return this.#keyType;
    }

    get itemType()               {
        return this.#itemType;
    }

    constructor(keyType              , itemType              ) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

export class TS0ObjectType {
    #keyType              ;
    #itemType              ;

    get itemType()               {
        return this.#itemType;
    }

    get keyType()               {
        return this.#keyType;
    }

    constructor(keyType              , itemType              ) {
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
    #presets           ;
    #extras                                  ;

    get extras()                                   {
        return this.#extras;
    }

    get presets()            {
        return this.#presets;
    }

    constructor(presets           , extras                                   = null) {
        this.#presets = presets;
        this.#extras = extras;
    }
}

export class TS0PresetArrayType {
    #presets                     ;

    get presets()                      {
        return this.#presets;
    }

    constructor(presets                     ) {
        this.#presets = presets;
    }
}

export class TS0ValueTypeType {
    #valueTypeFn                    ;

    get valueTypeFn()                     {
        return this.#valueTypeFn;
    }

    constructor(valueTypeFn                    ) {
        this.#valueTypeFn = valueTypeFn;
    }
}

;                               
                                                                    
                                                    
                 
                                                            
                                                                                              
                                                                              
;                                                    