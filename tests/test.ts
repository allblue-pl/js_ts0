import ts0 from "../index.ts";

let p = ts0.TPreset({
    a: [ 'string', ts0.TNull, ts0.TDefault(null) ],
});

ts0.assertType({ a: 5, }, p);