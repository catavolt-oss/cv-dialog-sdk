/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetSessionListPropertyResult = (function () {
            function XGetSessionListPropertyResult(_list, _dialogProps) {
                this._list = _list;
                this._dialogProps = _dialogProps;
            }
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "values", {
                get: function () {
                    return this._list;
                },
                enumerable: true,
                configurable: true
            });
            XGetSessionListPropertyResult.prototype.valuesAsDictionary = function () {
                var result = {};
                this.values.forEach(function (v) {
                    var pair = StringUtil.splitSimpleKeyValuePair(v);
                    result[pair[0]] = pair[1];
                });
                return result;
            };
            return XGetSessionListPropertyResult;
        })();
        dialog.XGetSessionListPropertyResult = XGetSessionListPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
