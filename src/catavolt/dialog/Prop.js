/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Prop = (function () {
            function Prop(_name, _value, _annos) {
                if (_annos === void 0) { _annos = []; }
                this._name = _name;
                this._value = _value;
                this._annos = _annos;
            }
            Prop.fromListOfWSValue = function (values) {
                var props = [];
                values.forEach(function (v) {
                    var propTry = Prop.fromWSValue(v);
                    if (propTry.isFailure)
                        return new Failure(propTry.failure);
                    props.push(propTry.success);
                });
                return new Success(props);
            };
            Prop.fromWSNameAndWSValue = function (name, value) {
                var propTry = Prop.fromWSValue(value);
                if (propTry.isFailure) {
                    return new Failure(propTry.failure);
                }
                return new Success(new Prop(name, propTry.success));
            };
            Prop.fromWSNamesAndValues = function (names, values) {
                if (names.length != values.length) {
                    return new Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
                }
                var list = [];
                for (var i = 0; i < names.length; i++) {
                    var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
                    if (propTry.isFailure) {
                        return new Failure(propTry.failure);
                    }
                    list.push(propTry.success);
                }
                return new Success(list);
            };
            Prop.fromWSValue = function (value) {
                var propValue = value;
                if (value && 'object' === typeof value) {
                    var PType = value['WS_PTYPE'];
                    var strVal = value['value'];
                    if (PType) {
                        if (PType === 'Decimal') {
                            propValue = Number(strVal);
                        }
                        else if (PType === 'Date') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'DateTime') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'Time') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'BinaryRef') {
                            var binaryRefTry = dialog.BinaryRef.fromWSValue(strVal, value['properties']);
                            if (binaryRefTry.isFailure)
                                return new Failure(binaryRefTry.failure);
                            propValue = binaryRefTry.success;
                        }
                        else if (PType === 'ObjectRef') {
                            propValue = dialog.ObjectRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'CodeRef') {
                            propValue = dialog.CodeRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoFix') {
                            propValue = dialog.GeoFix.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoLocation') {
                            propValue = catavolt.GeoLocation.fromFormattedValue(strVal);
                        }
                        else {
                            return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                        }
                    }
                }
                return new Success(propValue);
            };
            Prop.fromWS = function (otype, jsonObj) {
                var name = jsonObj['name'];
                var valueTry = Prop.fromWSValue(jsonObj['value']);
                if (valueTry.isFailure)
                    return new Failure(valueTry.failure);
                var annos = null;
                if (jsonObj['annos']) {
                    var annosListTry = dialog.DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', dialog.OType.factoryFn);
                    if (annosListTry.isFailure)
                        return new Failure(annosListTry.failure);
                    annos = annosListTry.success;
                }
                return new Success(new Prop(name, valueTry.success, annos));
            };
            Prop.toWSProperty = function (o) {
                if (typeof o === 'number') {
                    return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
                }
                else if (typeof o === 'object') {
                    if (o instanceof Date) {
                        return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
                    }
                    else if (o instanceof dialog.CodeRef) {
                        return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.ObjectRef) {
                        return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.GeoFix) {
                        return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
                    }
                    else if (o instanceof catavolt.GeoLocation) {
                        return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
                    }
                }
                else {
                    return o;
                }
            };
            Prop.toWSListOfProperties = function (list) {
                var result = { 'WS_LTYPE': 'Object' };
                var values = [];
                list.forEach(function (o) { values.push(Prop.toWSProperty(o)); });
                result['values'] = values;
                return result;
            };
            Prop.toWSListOfString = function (list) {
                return { 'WS_LTYPE': 'String', 'values': list };
            };
            Prop.toListOfWSProp = function (props) {
                var result = { 'WS_LTYPE': 'WSProp' };
                var values = [];
                props.forEach(function (prop) { values.push(prop.toWS()); });
                result['values'] = values;
                return result;
            };
            Object.defineProperty(Prop.prototype, "annos", {
                get: function () {
                    return this._annos;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.equals = function (prop) {
                return this.name === prop.name && this.value === prop.value;
            };
            Object.defineProperty(Prop.prototype, "backgroundColor", {
                get: function () {
                    return dialog.DataAnno.backgroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "foregroundColor", {
                get: function () {
                    return dialog.DataAnno.foregroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "imageName", {
                get: function () {
                    return dialog.DataAnno.imageName(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "imagePlacement", {
                get: function () {
                    return dialog.DataAnno.imagePlacement(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isBoldText", {
                get: function () {
                    return dialog.DataAnno.isBoldText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isItalicText", {
                get: function () {
                    return dialog.DataAnno.isItalicText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementCenter", {
                get: function () {
                    return dialog.DataAnno.isPlacementCenter(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementLeft", {
                get: function () {
                    return dialog.DataAnno.isPlacementLeft(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementRight", {
                get: function () {
                    return dialog.DataAnno.isPlacementRight(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementStretchUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isUnderline", {
                get: function () {
                    return dialog.DataAnno.isUnderlineText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "overrideText", {
                get: function () {
                    return dialog.DataAnno.overrideText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "tipText", {
                get: function () {
                    return dialog.DataAnno.tipText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
                if (this.annos) {
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                }
                return result;
            };
            return Prop;
        })();
        dialog.Prop = Prop;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
