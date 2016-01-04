/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRec;
        (function (EntityRec) {
            var Util;
            (function (Util) {
                function newEntityRec(objectId, props, annos) {
                    return annos ? new dialog.EntityRecImpl(objectId, props, annos) : new dialog.EntityRecImpl(objectId, props);
                }
                Util.newEntityRec = newEntityRec;
                function union(l1, l2) {
                    var result = ArrayUtil.copy(l1);
                    l2.forEach(function (p2) {
                        if (!l1.some(function (p1, i) {
                            if (p1.name === p2.name) {
                                result[i] = p2;
                                return true;
                            }
                            return false;
                        })) {
                            result.push(p2);
                        }
                    });
                    return result;
                }
                Util.union = union;
                //module level functions
                function fromWSEditorRecord(otype, jsonObj) {
                    var objectId = jsonObj['objectId'];
                    var namesJson = jsonObj['names'];
                    if (namesJson['WS_LTYPE'] !== 'String') {
                        return new Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
                    }
                    var namesRaw = namesJson['values'];
                    var propsJson = jsonObj['properties'];
                    if (propsJson['WS_LTYPE'] !== 'Object') {
                        return new Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
                    }
                    var propsRaw = propsJson['values'];
                    var propsTry = dialog.Prop.fromWSNamesAndValues(namesRaw, propsRaw);
                    if (propsTry.isFailure)
                        return new Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (jsonObj['propertyAnnotations']) {
                        var propAnnosObj = jsonObj['propertyAnnotations'];
                        var annotatedPropsTry = dialog.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
                        if (annotatedPropsTry.isFailure)
                            return new Failure(annotatedPropsTry.failure);
                    }
                    var recAnnos = null;
                    if (jsonObj['recordAnnotation']) {
                        var recAnnosTry = dialog.DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
                        if (recAnnosTry.isFailure)
                            return new Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    return new Success(new dialog.EntityRecImpl(objectId, props, recAnnos));
                }
                Util.fromWSEditorRecord = fromWSEditorRecord;
            })(Util = EntityRec.Util || (EntityRec.Util = {}));
        })(EntityRec = dialog.EntityRec || (dialog.EntityRec = {}));
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
