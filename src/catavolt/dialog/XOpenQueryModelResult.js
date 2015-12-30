/**
 * Created by rburson on 4/1/15.
 */
var DialogTriple_1 = require("./DialogTriple");
var OType_1 = require("./OType");
var EntityRecDef_1 = require("./EntityRecDef");
var Success_1 = require("../fp/Success");
var XOpenQueryModelResult = (function () {
    function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
        this.entityRecDef = entityRecDef;
        this.sortPropertyDef = sortPropertyDef;
        this.defaultActionId = defaultActionId;
    }
    XOpenQueryModelResult.fromWS = function (otype, jsonObj) {
        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];
        return DialogTriple_1.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', OType_1.OType.factoryFn).bind(function (propDefs) {
            var entityRecDef = new EntityRecDef_1.EntityRecDef(propDefs);
            return DialogTriple_1.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType_1.OType.factoryFn).bind(function (sortPropDefs) {
                return new Success_1.Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    };
    return XOpenQueryModelResult;
})();
exports.XOpenQueryModelResult = XOpenQueryModelResult;
