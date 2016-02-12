/**
 * Created by rburson on 3/9/15.
 */
import { Failure } from "../fp/Failure";
import { Success } from "../fp/Success";
import { NullRedirection } from "./NullRedirection";
import { Either } from "../fp/Either";
import { OType } from "./OType";
export class DialogTriple {
    static extractList(jsonObject, Ltype, extractor) {
        var result;
        if (jsonObject) {
            var lt = jsonObject['WS_LTYPE'];
            if (Ltype === lt) {
                if (jsonObject['values']) {
                    var realValues = [];
                    var values = jsonObject['values'];
                    values.every((item) => {
                        var extdValue = extractor(item);
                        if (extdValue.isFailure) {
                            result = new Failure(extdValue.failure);
                            return false;
                        }
                        realValues.push(extdValue.success);
                        return true;
                    });
                    if (!result) {
                        result = new Success(realValues);
                    }
                }
                else {
                    result = new Failure("DialogTriple::extractList: Values array not found");
                }
            }
            else {
                result = new Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
            }
        }
        return result;
    }
    static extractRedirection(jsonObject, Otype) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, () => {
            return new Success(new NullRedirection({}));
        });
        var answer;
        if (tripleTry.isSuccess) {
            var triple = tripleTry.success;
            answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
        }
        else {
            answer = new Failure(tripleTry.failure);
        }
        return answer;
    }
    static extractTriple(jsonObject, Otype, extractor) {
        return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
    }
    static extractValue(jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
    }
    static extractValueIgnoringRedirection(jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
    }
    static fromWSDialogObject(obj, Otype, factoryFn, ignoreRedirection = false) {
        if (!obj) {
            return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
        }
        else if (typeof obj !== 'object') {
            return new Success(obj);
        }
        try {
            if (!factoryFn) {
                /* Assume we're just going to coerce the exiting object */
                return DialogTriple.extractValue(obj, Otype, () => {
                    return new Success(obj);
                });
            }
            else {
                if (ignoreRedirection) {
                    return DialogTriple.extractValueIgnoringRedirection(obj, Otype, () => {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
                else {
                    return DialogTriple.extractValue(obj, Otype, () => {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
            }
        }
        catch (e) {
            return new Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
        }
    }
    static fromListOfWSDialogObject(jsonObject, Ltype, factoryFn, ignoreRedirection = false) {
        return DialogTriple.extractList(jsonObject, Ltype, (value) => {
            /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
             i.e. list items should be lype assignment compatible*/
            if (!value)
                return new Success(null);
            var Otype = value['WS_OTYPE'] || Ltype;
            return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
        });
    }
    static fromWSDialogObjectResult(jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, () => {
            return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
        });
    }
    static fromWSDialogObjectsResult(jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, () => {
            return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
        });
    }
    static _extractTriple(jsonObject, Otype, ignoreRedirection, extractor) {
        if (!jsonObject) {
            return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
        }
        else {
            if (Array.isArray(jsonObject)) {
                //verify we'll dealing with a nested List
                if (Otype.indexOf('List') !== 0) {
                    return new Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                }
            }
            else {
                var ot = jsonObject['WS_OTYPE'];
                if (!ot || Otype !== ot) {
                    return new Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                }
                else {
                    if (jsonObject['exception']) {
                        var dialogException = jsonObject['exception'];
                        return new Failure(dialogException);
                    }
                    else if (jsonObject['redirection'] && !ignoreRedirection) {
                        var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', OType.factoryFn);
                        if (drt.isFailure) {
                            return new Failure(drt.failure);
                        }
                        else {
                            const either = Either.left(drt.success);
                            return new Success(either);
                        }
                    }
                }
            }
            var result;
            if (extractor) {
                var valueTry = extractor();
                if (valueTry.isFailure) {
                    result = new Failure(valueTry.failure);
                }
                else {
                    result = new Success(Either.right(valueTry.success));
                }
            }
            else {
                result = new Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
            }
            return result;
        }
    }
    static _extractValue(jsonObject, Otype, ignoreRedirection, extractor) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
        var result;
        if (tripleTry.isFailure) {
            result = new Failure(tripleTry.failure);
        }
        else {
            var triple = tripleTry.success;
            if (triple.isLeft) {
                result = new Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
            }
            else {
                result = new Success(triple.right);
            }
        }
        return result;
    }
}
//# sourceMappingURL=DialogTriple.js.map