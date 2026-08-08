import ts0 from "../ts-lib/index.ts";

function test(a: any = 5): void {
    ts0.args(arguments, [ "number", ts0.TDefault ]);

    console.log(a);
}

test();

let b = ts0.assertType({}, ts0.TPreset({
    a: [ "number", ts0.TDefault(8) ],
}));

console.log(b);