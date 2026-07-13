import TS0AssertError from "./TS0AssertError.js";

export default function ts0Assert(value         , message         = "")                {
    if (!value)
        throw new TS0AssertError(message);
}