/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XOpenQueryModelResult = (function () {
            function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
                this.entityRecDef = entityRecDef;
                this.sortPropertyDef = sortPropertyDef;
                this.defaultActionId = defaultActionId;
            }
            XOpenQueryModelResult.fromWS = function (otype, jsonObj) {
                var queryRecDefJson = jsonObj['queryRecordDef'];
                var defaultActionId = queryRecDefJson['defaultActionId'];
                return dialog.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', dialog.OType.factoryFn).bind(function (propDefs) {
                    var entityRecDef = new dialog.EntityRecDef(propDefs);
                    return dialog.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', dialog.OType.factoryFn).bind(function (sortPropDefs) {
                        return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
                    });
                });
            };
            return XOpenQueryModelResult;
        })();
        dialog.XOpenQueryModelResult = XOpenQueryModelResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
