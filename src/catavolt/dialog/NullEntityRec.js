/**
 * Created by rburson on 4/24/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullEntityRec = (function () {
            function NullEntityRec() {
            }
            Object.defineProperty(NullEntityRec.prototype, "annos", {
                get: function () { return []; },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.annosAtName = function (propName) {
                return [];
            };
            NullEntityRec.prototype.afterEffects = function (after) {
                return after;
            };
            Object.defineProperty(NullEntityRec.prototype, "backgroundColor", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.backgroundColorFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "foregroundColor", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.foregroundColorFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "imageName", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.imageNameFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "imagePlacement", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.imagePlacementFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "isBoldText", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isBoldTextFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isItalicText", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isItalicTextFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementCenter", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementCenterFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementLeft", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementLeftFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementRight", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementRightFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementStretchUnderFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementUnder", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementUnderFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isUnderline", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isUnderlineFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "objectId", {
                get: function () { return null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "overrideText", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.overrideTextFor = function (propName) {
                return null;
            };
            NullEntityRec.prototype.propAtIndex = function (index) {
                return null;
            };
            NullEntityRec.prototype.propAtName = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "propCount", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "propNames", {
                get: function () {
                    return [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "props", {
                get: function () { return []; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "propValues", {
                get: function () {
                    return [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "tipText", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.tipTextFor = function (propName) {
                return null;
            };
            NullEntityRec.prototype.toEntityRec = function () {
                return this;
            };
            NullEntityRec.prototype.toWSEditorRecord = function () {
                var result = { 'WS_OTYPE': 'WSEditorRecord' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['names'] = dialog.Prop.toWSListOfString(this.propNames);
                result['properties'] = dialog.Prop.toWSListOfProperties(this.propValues);
                return result;
            };
            NullEntityRec.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSEntityRec' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['props'] = dialog.Prop.toListOfWSProp(this.props);
                if (this.annos)
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                return result;
            };
            NullEntityRec.prototype.valueAtName = function (propName) {
                return null;
            };
            NullEntityRec.singleton = new NullEntityRec();
            return NullEntityRec;
        })();
        dialog.NullEntityRec = NullEntityRec;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
