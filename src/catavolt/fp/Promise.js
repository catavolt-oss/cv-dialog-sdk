/**
 * Created by rburson on 3/6/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Promise = (function () {
            function Promise(label) {
                this._future = fp.Future.createFuture(label);
            }
            /** --------------------- PUBLIC ------------------------------*/
            Promise.prototype.isComplete = function () { return this._future.isComplete; };
            Promise.prototype.complete = function (t) {
                //Log.debug('Promise calling complete on Future...');
                this._future.complete(t);
                return this;
            };
            Promise.prototype.failure = function (error) {
                this.complete(new fp.Failure(error));
            };
            Object.defineProperty(Promise.prototype, "future", {
                get: function () {
                    return this._future;
                },
                enumerable: true,
                configurable: true
            });
            Promise.prototype.success = function (value) {
                this.complete(new fp.Success(value));
            };
            return Promise;
        })();
        fp.Promise = Promise;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
