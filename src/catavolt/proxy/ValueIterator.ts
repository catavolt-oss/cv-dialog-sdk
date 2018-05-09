/**
 * NOTE: Had to write this class because we are back-level and cannot make use of modern iterators.
 */
export class ValueIterator<T> {
    private _array: T[];
    private _nextIndex = 0;

    constructor(array: T[]) {
        this._array = array;
    }

    public done(): boolean {
        return this._nextIndex >= this._array.length;
    }

    public next(): T {
        return this._array[this._nextIndex++];
    }
}
