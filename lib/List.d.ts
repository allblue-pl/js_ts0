export default class List<KeyType, ValueType> {
    #private;
    get size(): number;
    constructor(iterable?: Array<[KeyType, ValueType]> | null);
    [Symbol.iterator](): ListIterator<KeyType, ValueType>;
    addAt(index: number, key: KeyType, value: ValueType): void;
    clear(): void;
    delete(key: KeyType): void;
    deleteAt(index: number): void;
    get(key: KeyType): ValueType;
    getAt(index: number): ValueType;
    getKeyAt(index: number): KeyType;
    getKeys(): Array<KeyType>;
    getKeysIterator(): ArrayIterator<KeyType>;
    getValues(): Array<ValueType>;
    has(key: KeyType): boolean;
    includes(value: ValueType): boolean;
    indexOf(value: ValueType): number;
    remove(value: ValueType): void;
    set(key: KeyType, value: ValueType): void;
    setAt(index: number, key: KeyType, value: ValueType): void;
    slice(): void;
    sort(compareFn: (a: {
        key: KeyType;
        value: ValueType;
    }, b: {
        key: KeyType;
        value: ValueType;
    }) => number): void;
    values(): ValueType[];
    _getIndexE(key: KeyType): number;
}
declare class ListIterator<KeyType, ValueType> implements Iterator<[KeyType, ValueType]> {
    #private;
    constructor(list: List<KeyType, ValueType>);
    next(): IteratorResult<[KeyType, ValueType]>;
}
export {};
//# sourceMappingURL=List.d.ts.map