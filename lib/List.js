export default class List {
    get size() {
        return this.#values.length;
    }
    #keys;
    #values;
    constructor(iterable = null) {
        this.#keys = [];
        this.#values = [];
        if (iterable !== null) {
            for (let item of iterable)
                this.set(item[0], item[1]);
        }
    }
    [Symbol.iterator]() {
        return new ListIterator(this);
    }
    addAt(index, key, value) {
        if (index < 0 || index > this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);
        if (this.#values.length === index) {
            this.#keys.push(key);
            this.#values.push(value);
        }
        else {
            this.#keys.splice(index, 0, key);
            this.#values.splice(index, 0, value);
        }
    }
    clear() {
        this.#keys = [];
        this.#values = [];
    }
    delete(key) {
        let index = this._getIndexE(key);
        this.deleteAt(index);
    }
    deleteAt(index) {
        this.#keys.splice(index, 1);
        this.#values.splice(index, 1);
    }
    get(key) {
        let index = this._getIndexE(key);
        return this.#values[index];
    }
    getAt(index) {
        if (index < 0 || index >= this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);
        return this.#values[index];
    }
    getKeyAt(index) {
        if (index < 0 || index >= this.#values.length)
            throw new Error(`Key at \`${index}\` does not exist in \`js0_List\`.`);
        return this.#keys[index];
    }
    getKeys() {
        return this.#keys.slice();
    }
    getKeysIterator() {
        return this.#keys[Symbol.iterator]();
    }
    getValues() {
        return this.#values.slice();
    }
    has(key) {
        return this.#keys.includes(key);
    }
    includes(value) {
        return this.#values.includes(value);
    }
    indexOf(value) {
        return this.#values.indexOf(value);
    }
    remove(value) {
        for (let i = this.size - 1; i >= 0; i--) {
            if (this.getAt(i) === value) {
                this.deleteAt(i);
                return;
            }
        }
        throw new Error(`Value '${value}' does not exist in js0_List.`);
    }
    set(key, value) {
        let index = this.#keys.indexOf(key);
        if (index === -1)
            index = this.#values.length;
        this.setAt(index, key, value);
    }
    setAt(index, key, value) {
        if (index < 0 || index > this.#values.length)
            throw new Error(`Index \`${index}\` does not exist in \`js0_List\`.`);
        if (index === this.#values.length) {
            this.#keys.push(key);
            this.#values.push(value);
        }
        else {
            this.#keys[index] = key;
            this.#values[index] = value;
        }
    }
    slice() {
    }
    sort(compareFn) {
        let newKeys = this.#keys.slice();
        newKeys.sort((aKey, bKey) => {
            return compareFn({ key: aKey, value: this.get(aKey) }, { key: bKey, value: this.get(bKey) });
        });
        let newValues = [];
        for (let i = 0; i < this.size; i++)
            newValues.push(this.get(newKeys[i]));
        this.#keys = newKeys;
        this.#values = newValues;
    }
    values() {
        return this.#values.slice();
    }
    _getIndexE(key) {
        let index = this.#keys.indexOf(key);
        if (index === -1)
            throw new Error(`Key \`${key}\` does not exist in \`js0_List\`.`);
        return index;
    }
}
class ListIterator {
    #list;
    #iterator;
    constructor(list) {
        this.#list = list;
        this.#iterator = list.getKeysIterator();
    }
    next() {
        let keyItem = this.#iterator.next();
        if (keyItem.done)
            return { value: undefined, done: true, };
        return {
            value: [keyItem.value, this.#list.get(keyItem.value)],
            done: false,
        };
    }
}
