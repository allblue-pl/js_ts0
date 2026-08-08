
export default class TS0TypeError extends Error {
    constructor(message: string) {
        super(message);

        // let stack = this.stack;
        // let stack_array = stack.split('\n');
        // stack_array.splice(1, 3);
        // this.stack = stack_array.join('\n');
    }
}