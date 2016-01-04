/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XQueryResult = (function () {
            function XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
                this.entityRecs = entityRecs;
                this.entityRecDef = entityRecDef;
                this.hasMore = hasMore;
                this.sortPropDefs = sortPropDefs;
                this.defaultActionId = defaultActionId;
                this.dialogProps = dialogProps;
            }
            XQueryResult.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', dialog.OType.factoryFn).bind(function (entityRecDef) {
                    var entityRecDefJson = jsonObj['queryRecordDef'];
                    var actionId = jsonObj['defaultActionId'];
                    return dialog.DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', dialog.OType.factoryFn).bind(function (sortPropDefs) {
                        var queryRecsJson = jsonObj['queryRecords'];
                        if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                            return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                        }
                        var queryRecsValues = queryRecsJson['values'];
                        var entityRecs = [];
                        for (var i = 0; i < queryRecsValues.length; i++) {
                            var queryRecValue = queryRecsValues[i];
                            if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                                return new Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                            }
                            var objectId = queryRecValue['objectId'];
                            var recPropsObj = queryRecValue['properties'];
                            if (recPropsObj['WS_LTYPE'] !== 'Object') {
                                return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                            }
                            var recPropsObjValues = recPropsObj['values'];
                            var propsTry = dialog.Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                            if (propsTry.isFailure)
                                return new Failure(propsTry.failure);
                            var props = propsTry.success;
                            if (queryRecValue['propertyAnnotations']) {
                                var propAnnosJson = queryRecValue['propertyAnnotations'];
                                var annotatedPropsTry = dialog.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                                if (annotatedPropsTry.isFailure)
                                    return new Failure(annotatedPropsTry.failure);
                                props = annotatedPropsTry.success;
                            }
                            var recAnnos = null;
                            if (queryRecValue['recordAnnotation']) {
                                var recAnnosTry = dialog.DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', dialog.OType.factoryFn);
                                if (recAnnosTry.isFailure)
                                    return new Failure(recAnnosTry.failure);
                                recAnnos = recAnnosTry.success;
                            }
                            var entityRec = dialog.EntityRec.Util.newEntityRec(objectId, props, recAnnos);
                            entityRecs.push(entityRec);
                        }
                        var dialogProps = jsonObj['dialogProperties'];
                        var hasMore = jsonObj['hasMore'];
                        return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
                    });
                });
            };
            return XQueryResult;
        })();
        dialog.XQueryResult = XQueryResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
