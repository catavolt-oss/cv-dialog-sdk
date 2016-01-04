/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DataAnno = (function () {
            function DataAnno(_name, _value) {
                this._name = _name;
                this._value = _value;
            }
            DataAnno.annotatePropsUsingWSDataAnnotation = function (props, jsonObj) {
                return dialog.DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', dialog.OType.factoryFn).bind(function (propAnnos) {
                    var annotatedProps = [];
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];
                        var annos = propAnnos[i];
                        if (annos) {
                            annotatedProps.push(new dialog.Prop(p.name, p.value, annos));
                        }
                        else {
                            annotatedProps.push(p);
                        }
                    }
                    return new Success(annotatedProps);
                });
            };
            DataAnno.backgroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isBackgroundColor;
                });
                return result ? result.backgroundColor : null;
            };
            DataAnno.foregroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isForegroundColor;
                });
                return result ? result.foregroundColor : null;
            };
            DataAnno.fromWS = function (otype, jsonObj) {
                var stringObj = jsonObj['annotations'];
                if (stringObj['WS_LTYPE'] !== 'String') {
                    return new Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
                }
                var annoStrings = stringObj['values'];
                var annos = [];
                for (var i = 0; i < annoStrings.length; i++) {
                    annos.push(DataAnno.parseString(annoStrings[i]));
                }
                return new Success(annos);
            };
            DataAnno.imageName = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImageName;
                });
                return result ? result.value : null;
            };
            DataAnno.imagePlacement = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImagePlacement;
                });
                return result ? result.value : null;
            };
            DataAnno.isBoldText = function (annos) {
                return annos.some(function (anno) { return anno.isBoldText; });
            };
            DataAnno.isItalicText = function (annos) {
                return annos.some(function (anno) { return anno.isItalicText; });
            };
            DataAnno.isPlacementCenter = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementCenter; });
            };
            DataAnno.isPlacementLeft = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementLeft; });
            };
            DataAnno.isPlacementRight = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementRight; });
            };
            DataAnno.isPlacementStretchUnder = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementStretchUnder; });
            };
            DataAnno.isPlacementUnder = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementUnder; });
            };
            DataAnno.isUnderlineText = function (annos) {
                return annos.some(function (anno) { return anno.isUnderlineText; });
            };
            DataAnno.overrideText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isOverrideText;
                });
                return result ? result.value : null;
            };
            DataAnno.tipText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isTipText;
                });
                return result ? result.value : null;
            };
            DataAnno.toListOfWSDataAnno = function (annos) {
                var result = { 'WS_LTYPE': 'WSDataAnno' };
                var values = [];
                annos.forEach(function (anno) { values.push(anno.toWS()); });
                result['values'] = values;
                return result;
            };
            DataAnno.parseString = function (formatted) {
                var pair = StringUtil.splitSimpleKeyValuePair(formatted);
                return new DataAnno(pair[0], pair[1]);
            };
            Object.defineProperty(DataAnno.prototype, "backgroundColor", {
                get: function () {
                    return this.isBackgroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "foregroundColor", {
                get: function () {
                    return this.isForegroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.equals = function (dataAnno) {
                return this.name === dataAnno.name;
            };
            Object.defineProperty(DataAnno.prototype, "isBackgroundColor", {
                get: function () {
                    return this.name === DataAnno.BACKGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isBoldText", {
                get: function () {
                    return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isForegroundColor", {
                get: function () {
                    return this.name === DataAnno.FOREGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImageName", {
                get: function () {
                    return this.name === DataAnno.IMAGE_NAME;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImagePlacement", {
                get: function () {
                    return this.name === DataAnno.IMAGE_PLACEMENT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isItalicText", {
                get: function () {
                    return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isOverrideText", {
                get: function () {
                    return this.name === DataAnno.OVERRIDE_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementCenter", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementLeft", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementRight", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isTipText", {
                get: function () {
                    return this.name === DataAnno.TIP_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isUnderlineText", {
                get: function () {
                    return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.toWS = function () {
                return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
            };
            DataAnno.BOLD_TEXT = "BOLD_TEXT";
            DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
            DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
            DataAnno.IMAGE_NAME = "IMAGE_NAME";
            DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
            DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
            DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
            DataAnno.TIP_TEXT = "TIP_TEXT";
            DataAnno.UNDERLINE = "UNDERLINE";
            DataAnno.TRUE_VALUE = "1";
            DataAnno.PLACEMENT_CENTER = "CENTER";
            DataAnno.PLACEMENT_LEFT = "LEFT";
            DataAnno.PLACEMENT_RIGHT = "RIGHT";
            DataAnno.PLACEMENT_UNDER = "UNDER";
            DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
            return DataAnno;
        })();
        dialog.DataAnno = DataAnno;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
