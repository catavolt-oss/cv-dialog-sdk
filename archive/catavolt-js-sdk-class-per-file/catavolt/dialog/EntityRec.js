/**
 * Created by rburson on 3/30/15.
 */
import { DataAnno } from './DataAnno';
import { Prop } from './Prop';
import { EntityRecImpl } from "./EntityRecImpl";
import { ArrayUtil } from "../util/ArrayUtil";
import { Success } from "../fp/Success";
import { Failure } from "../fp/Failure";
export class EntityRecUtil {
    static newEntityRec(objectId, props, annos) {
        return annos ? new EntityRecImpl(objectId, ArrayUtil.copy(props), ArrayUtil.copy(annos)) : new EntityRecImpl(objectId, ArrayUtil.copy(props));
    }
    static union(l1, l2) {
        var result = ArrayUtil.copy(l1);
        l2.forEach((p2) => {
            if (!l1.some((p1, i) => {
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
    //module level functions
    static fromWSEditorRecord(otype, jsonObj) {
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
        var propsTry = Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure)
            return new Failure(propsTry.failure);
        var props = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure)
                return new Failure(annotatedPropsTry.failure);
        }
        var recAnnos = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry = DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure)
                return new Failure(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new Success(new EntityRecImpl(objectId, props, recAnnos));
    }
}
