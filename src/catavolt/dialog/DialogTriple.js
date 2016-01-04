/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogTriple = (function () {
            function DialogTriple() {
            }
            DialogTriple.extractList = function (jsonObject, Ltype, extractor) {
                var result;
                if (jsonObject) {
                    var lt = jsonObject['WS_LTYPE'];
                    if (Ltype === lt) {
                        if (jsonObject['values']) {
                            var realValues = [];
                            var values = jsonObject['values'];
                            values.every(function (item) {
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
            };
            DialogTriple.extractRedirection = function (jsonObject, Otype) {
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () { return new Success(new dialog.NullRedirection({})); });
                var answer;
                if (tripleTry.isSuccess) {
                    var triple = tripleTry.success;
                    answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
                }
                else {
                    answer = new Failure(tripleTry.failure);
                }
                return answer;
            };
            DialogTriple.extractTriple = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValueIgnoringRedirection = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
            };
            DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn, ignoreRedirection) {
                if (ignoreRedirection === void 0) { ignoreRedirection = false; }
                if (!obj) {
                    return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
                }
                else if (typeof obj !== 'object') {
                    return new Success(obj);
                }
                try {
                    if (!factoryFn) {
                        /* Assume we're just going to coerce the exiting object */
                        return DialogTriple.extractValue(obj, Otype, function () {
                            return new Success(obj);
                        });
                    }
                    else {
                        if (ignoreRedirection) {
                            return DialogTriple.extractValueIgnoringRedirection(obj, Otype, function () {
                                return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                            });
                        }
                        else {
                            return DialogTriple.extractValue(obj, Otype, function () {
                                return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                            });
                        }
                    }
                }
                catch (e) {
                    return new Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
                }
            };
            DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn, ignoreRedirection) {
                if (ignoreRedirection === void 0) { ignoreRedirection = false; }
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
                    i.e. list items should be lype assignment compatible*/
                    if (!value)
                        return new Success(null);
                    var Otype = value['WS_OTYPE'] || Ltype;
                    return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
                });
            };
            DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectsResult = function (jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
                });
            };
            DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
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
                                var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', dialog.OType.factoryFn);
                                if (drt.isFailure) {
                                    return new Failure(drt.failure);
                                }
                                else {
                                    return new Success(Either.left(drt.success));
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
            };
            DialogTriple._extractValue = function (jsonObject, Otype, ignoreRedirection, extractor) {
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
            };
            return DialogTriple;
        })();
        dialog.DialogTriple = DialogTriple;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
