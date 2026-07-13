
export default class TS0AssertError extends Error {
    constructor(message         = "") {
        super('TS0 Assertion Error' + (message === "" ? "" : `: ${message}`));
    }
}