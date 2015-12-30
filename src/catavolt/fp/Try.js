/**
 * Created by rburson on 3/5/15.
 */
var Success_1 = require('./Success');
var Failure_1 = require('./Failure');
var Try = (function () {
    function Try() {
    }
    Try.flatten = function (tryList) {
        var successes = [];
        var failures = [];
        tryList.forEach(function (t) {
            if (t.isFailure) {
                failures.push(t.failure);
            }
            else {
                if (Array.isArray(t.success) && Try.isListOfTry(t.success)) {
                    var flattened = Try.flatten(t.success);
                    if (flattened.isFailure) {
                        failures.push(flattened.failure);
                    }
                    else {
                        successes.push(flattened.success);
                    }
                }
                else {
                    successes.push(t.success);
                }
            }
        });
        if (failures.length > 0) {
            return new Failure_1.Failure(failures);
        }
        else {
            return new Success_1.Success(successes);
        }
    };
    Try.isListOfTry = function (list) {
        return list.every(function (value) {
            return (value instanceof Try);
        });
    };
    Try.prototype.bind = function (f) {
        return this.isFailure ? new Failure_1.Failure(this.failure) : f(this.success);
    };
    Object.defineProperty(Try.prototype, "failure", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isFailure", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isSuccess", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.map = function (f) {
        return this.isFailure ? new Failure_1.Failure(this.failure) : new Success_1.Success(f(this.success));
    };
    Object.defineProperty(Try.prototype, "success", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Try;
})();
exports.Try = Try;
