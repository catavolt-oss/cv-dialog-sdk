/**
 * Created by rburson on 4/1/15.
 */
import { DialogTriple } from './DialogTriple';
import { OType } from './OType';
import { Success } from '../fp/Success';
import { Failure } from '../fp/Failure';
import { EntityRecUtil } from "./EntityRec";
import { Prop } from "./Prop";
import { DataAnno } from "./DataAnno";
export class XQueryResult {
    constructor(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
        this.entityRecs = entityRecs;
        this.entityRecDef = entityRecDef;
        this.hasMore = hasMore;
        this.sortPropDefs = sortPropDefs;
        this.defaultActionId = defaultActionId;
        this.dialogProps = dialogProps;
    }
    static fromWS(otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', OType.factoryFn).bind((entityRecDef) => {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId = jsonObj['defaultActionId'];
            return DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs) => {
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
                    var propsTry = Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure)
                        return new Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure)
                            return new Failure(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', OType.factoryFn);
                        if (recAnnosTry.isFailure)
                            return new Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec = EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps = jsonObj['dialogProperties'];
                var hasMore = jsonObj['hasMore'];
                return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
            });
        });
    }
}
