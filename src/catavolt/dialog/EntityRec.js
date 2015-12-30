/**
 * Created by rburson on 3/30/15.
 */
var DataAnno_1 = require('./DataAnno');
var Prop_1 = require('./Prop');
var EntityRecImpl_1 = require("./EntityRecImpl");
var ArrayUtil_1 = require("../util/ArrayUtil");
var Success_1 = require("../fp/Success");
var Failure_1 = require("../fp/Failure");
var EntityRecUtil = (function () {
    function EntityRecUtil() {
    }
    EntityRecUtil.newEntityRec = function (objectId, props, annos) {
        return annos ? new EntityRecImpl_1.EntityRecImpl(objectId, props, annos) : new EntityRecImpl_1.EntityRecImpl(objectId, props);
    };
    EntityRecUtil.union = function (l1, l2) {
        var result = ArrayUtil_1.ArrayUtil.copy(l1);
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
    };
    //module level functions
    EntityRecUtil.fromWSEditorRecord = function (otype, jsonObj) {
        var objectId = jsonObj['objectId'];
        var namesJson = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new Failure_1.Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new Failure_1.Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw = propsJson['values'];
        var propsTry = Prop_1.Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure)
            return new Failure_1.Failure(propsTry.failure);
        var props = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry = DataAnno_1.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure)
                return new Failure_1.Failure(annotatedPropsTry.failure);
        }
        var recAnnos = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry = DataAnno_1.DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure)
                return new Failure_1.Failure(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new Success_1.Success(new EntityRecImpl_1.EntityRecImpl(objectId, props, recAnnos));
    };
    return EntityRecUtil;
})();
exports.EntityRecUtil = EntityRecUtil;
