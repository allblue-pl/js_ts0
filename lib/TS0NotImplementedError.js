
export default class TS0NotImplementedError extends Error {
    constructor(message         = "") {
        super('TS0 Not Implemented Error' + (message === "" ? "" : `: ${message}`));
    }
}