/**
 * Created by rburson on 3/16/15.
 */
var Either = (function () {
    function Either() {
    }
    Either.left = function (left) {
        var either = new Either();
        either._left = left;
        return either;
    };
    Either.right = function (right) {
        var either = new Either();
        either._right = right;
        return either;
    };
    Object.defineProperty(Either.prototype, "isLeft", {
        get: function () {
            return !!this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "isRight", {
        get: function () {
            return !!this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return Either;
})();
exports.Either = Either;
