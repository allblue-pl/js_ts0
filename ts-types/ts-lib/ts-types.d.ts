export type TS0RawArray = Array<boolean | null | number | string | TS0RawArray | TS0RawObject>;
export type TS0RawObject = {
    [key: string]: boolean | null | number | string | TS0RawArray | TS0RawObject;
};
