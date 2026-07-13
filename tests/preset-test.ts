import ts0 from "../ts-lib/index.ts";

let p = ts0.TArray(ts0.TPreset({
    tsconfig: [ "string", ts0.TNull ],
    libs: ts0.TObject("string", "string"),
}));

ts0.assertType([
    {
        tsconfig: "test",
        libs: [ "arr" ],
    }
], p);