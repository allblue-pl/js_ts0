import TS0AssertError from "./TS0AssertError.ts";

export default function ts0Assert(value: boolean, message: string = ""): asserts value {
    if (!value)
        throw new TS0AssertError(message);
}