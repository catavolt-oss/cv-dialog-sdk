/**
 * Created by rburson on 4/1/15.
 */
var DialogTriple_1 = require('./DialogTriple');
var OType_1 = require('./OType');
var Success_1 = require('../fp/Success');
var Failure_1 = require('../fp/Failure');
var EntityRec_1 = require("./EntityRec");
var Prop_1 = require("./Prop");
var DataAnno_1 = require("./DataAnno");
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
        return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', OType_1.OType.factoryFn).bind(function (entityRecDef) {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId = jsonObj['defaultActionId'];
            return DialogTriple_1.DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType_1.OType.factoryFn).bind(function (sortPropDefs) {
                var queryRecsJson = jsonObj['queryRecords'];
                if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                    return new Failure_1.Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                }
                var queryRecsValues = queryRecsJson['values'];
                var entityRecs = [];
                for (var i = 0; i < queryRecsValues.length; i++) {
                    var queryRecValue = queryRecsValues[i];
                    if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                        return new Failure_1.Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                    }
                    var objectId = queryRecValue['objectId'];
                    var recPropsObj = queryRecValue['properties'];
                    if (recPropsObj['WS_LTYPE'] !== 'Object') {
                        return new Failure_1.Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                    }
                    var recPropsObjValues = recPropsObj['values'];
                    var propsTry = Prop_1.Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure)
                        return new Failure_1.Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = DataAnno_1.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure)
                            return new Failure_1.Failure(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = DialogTriple_1.DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', OType_1.OType.factoryFn);
                        if (recAnnosTry.isFailure)
                            return new Failure_1.Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec = EntityRec_1.EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps = jsonObj['dialogProperties'];
                var hasMore = jsonObj['hasMore'];
                return new Success_1.Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
            });
        });
    };
    return XQueryResult;
})();
exports.XQueryResult = XQueryResult;
