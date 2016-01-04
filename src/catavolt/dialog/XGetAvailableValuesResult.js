/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetAvailableValuesResult = (function () {
            function XGetAvailableValuesResult(list) {
                this.list = list;
            }
            XGetAvailableValuesResult.fromWS = function (otype, jsonObj) {
                var listJson = jsonObj['list'];
                var valuesJson = listJson['values'];
                return dialog.Prop.fromListOfWSValue(valuesJson).bind(function (values) {
                    return new Success(new XGetAvailableValuesResult(values));
                });
            };
            return XGetAvailableValuesResult;
        })();
        dialog.XGetAvailableValuesResult = XGetAvailableValuesResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
