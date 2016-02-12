/**
 * Created by rburson on 3/16/15.
 */
export class Either {
    static left(left) {
        var either = new Either();
        either._left = left;
        return either;
    }
    static right(right) {
        var either = new Either();
        either._right = right;
        return either;
    }
    get isLeft() {
        return !!this._left;
    }
    get isRight() {
        return !!this._right;
    }
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
}
//# sourceMappingURL=Either.js.map