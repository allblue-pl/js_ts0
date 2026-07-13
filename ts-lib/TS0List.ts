
export default class TS0List<KeyType, ValueType> {
    get size(): number {
        return this.#values.length;
    }


    #keys: Array<KeyType>;
    #values: Array<ValueType>;


    constructor(iterable: Array<[KeyType, ValueType]>|null = null) {
        this.#keys = [];
        this.#values = [];

        if (iterable !== null) {
            for (let item of iterable)
                this.set(item[0], item[1]);
        }
    }

    [Symbol.iterator](): ListIterator<KeyType, ValueType> {
        return new ListIterator(this);
    }

    addAt(index: number, key: KeyType, value: ValueType): void {
        if (index < 0 || index > this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);

        if (this.#values.length === index) {
            this.#keys.push(key);
            this.#values.push(value);
        } else {
            this.#keys.splice(index, 0, key);
            this.#values.splice(index, 0, value);
        }
    }

    clear(): void {
        this.#keys = [];
        this.#values = [];
    }

    delete(key: KeyType): void {
        let index = this._getIndexE(key);
        this.deleteAt(index);
    }

    deleteAt(index: number): void {
        this.#keys.splice(index, 1);
        this.#values.splice(index, 1);
    }

    get(key: KeyType): ValueType {
        let index = this._getIndexE(key);
        return this.#values[index] as ValueType;
    }

    getAt(index: number): ValueType {
        if (index < 0 || index >= this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);

        return this.#values[index] as ValueType;
    }

    getKeyAt(index: number): KeyType {
        if (index < 0 || index >= this.#values.length)
            throw new Error(`Key at \`${index}\` does not exist in \`js0_List\`.`);

        return this.#keys[index] as KeyType;
    }

    getKeys(): Array<KeyType> {
        return this.#keys.slice();
    }

    getKeysIterator(): ArrayIterator<KeyType> {
        return this.#keys[Symbol.iterator]();
    }

    getValues(): Array<ValueType> {
        return this.#values.slice();
    }

    has(key: KeyType): boolean {
        return this.#keys.includes(key);
    }

    includes(value: ValueType): boolean {
        return this.#values.includes(value);
    }

    indexOf(value: ValueType): number {
        return this.#values.indexOf(value);
    }

    remove(value: ValueType): void {
        for (let i = this.size - 1; i >= 0; i--) {
            if (this.getAt(i) === value) {
                this.deleteAt(i);
                return;
            }
        }     

        throw new Error(`Value '${value}' does not exist in js0_List.`);
    }

    set(key: KeyType, value: ValueType): void {
        let index = this.#keys.indexOf(key);
        if (index === -1)
            index = this.#values.length;

        this.setAt(index, key, value);
    }

    setAt(index: number, key: KeyType, value: ValueType): void {
        if (index < 0 || index > this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);

        if (index === this.#values.length) {
            this.#keys.push(key);
            this.#values.push(value);
        } else {
            this.#keys[index] = key;
            this.#values[index] = value;
        }
    }

    // slice() {

    // }

    sort(compareFn: (a: { key: KeyType, value: ValueType }, 
            b: { key: KeyType, value: ValueType }) => number): void {
        let newKeys = this.#keys.slice();
        newKeys.sort((aKey, bKey) => {
            return compareFn({ key: aKey, value: this.get(aKey) as ValueType },
                    { key: bKey, value: this.get(bKey) as ValueType });
        });

        let newValues = [];
        for (let i = 0; i < this.size; i++)
            newValues.push(this.get(newKeys[i]));

        this.#keys = newKeys;
        this.#values = newValues as Array<ValueType>;
    }

    values(): Array<ValueType> {
        return this.#values.slice();
    }


    _getIndexE(key: KeyType): number {
        let index = this.#keys.indexOf(key);
        if (index === -1)
            throw new Error(`Key \`${key}\` does not exist in \`js0_List\`.`);

        return index;
    }
}


class ListIterator<KeyType, ValueType> implements Iterator<[ KeyType, ValueType ]> {
    #list: TS0List<KeyType, ValueType>;
    #iterator: ArrayIterator<KeyType>;


    constructor(list: TS0List<KeyType, ValueType>) {
        this.#list = list;
        this.#iterator = list.getKeysIterator();
    }

    next(): IteratorResult<[ KeyType, ValueType ]> {
        let keyItem = this.#iterator.next();

        if (keyItem.done)
            return { value: undefined, done: true, };

        return {
            value: [ keyItem.value, this.#list.get(keyItem.value) as ValueType ],
            done: false,
        };
    }
}
