/**
 * Created by rburson on 3/6/15.
 */
var Future_1 = require('./Future');
var Success_1 = require('./Success');
var Failure_1 = require('./Failure');
var Promise = (function () {
    function Promise(label) {
        this._future = Future_1.Future.createFuture(label);
    }
    /** --------------------- PUBLIC ------------------------------*/
    Promise.prototype.isComplete = function () {
        return this._future.isComplete;
    };
    Promise.prototype.complete = function (t) {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    };
    Promise.prototype.failure = function (error) {
        this.complete(new Failure_1.Failure(error));
    };
    Object.defineProperty(Promise.prototype, "future", {
        get: function () {
            return this._future;
        },
        enumerable: true,
        configurable: true
    });
    Promise.prototype.success = function (value) {
        this.complete(new Success_1.Success(value));
    };
    return Promise;
})();
exports.Promise = Promise;
