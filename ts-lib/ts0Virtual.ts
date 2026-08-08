import TS0NotImplementedError from "./TS0NotImplementedError.ts";

export default function ts0Virtual(classObject: Object): never {
    if (classObject === null) {
        console.warn(new Error());
        throw new TS0NotImplementedError();
    }

    console.warn(new Error());
    throw new TS0NotImplementedError(`Method not implemented in:` +
            ` \`${classObject.constructor.name}\`.`);
}