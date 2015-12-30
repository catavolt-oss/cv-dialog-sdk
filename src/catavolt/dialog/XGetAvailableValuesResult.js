/**
 * Created by rburson on 4/1/15.
 */
var Success_1 = require("../fp/Success");
var Prop_1 = require("./Prop");
var XGetAvailableValuesResult = (function () {
    function XGetAvailableValuesResult(list) {
        this.list = list;
    }
    XGetAvailableValuesResult.fromWS = function (otype, jsonObj) {
        var listJson = jsonObj['list'];
        var valuesJson = listJson['values'];
        return Prop_1.Prop.fromListOfWSValue(valuesJson).bind(function (values) {
            return new Success_1.Success(new XGetAvailableValuesResult(values));
        });
    };
    return XGetAvailableValuesResult;
})();
exports.XGetAvailableValuesResult = XGetAvailableValuesResult;
