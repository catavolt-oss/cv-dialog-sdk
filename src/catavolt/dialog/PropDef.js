/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PropDef = (function () {
            function PropDef(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
                this._name = _name;
                this._type = _type;
                this._elementType = _elementType;
                this._style = _style;
                this._propertyLength = _propertyLength;
                this._propertyScale = _propertyScale;
                this._presLength = _presLength;
                this._presScale = _presScale;
                this._dataDictionaryKey = _dataDictionaryKey;
                this._maintainable = _maintainable;
                this._writeEnabled = _writeEnabled;
                this._canCauseSideEffects = _canCauseSideEffects;
            }
            Object.defineProperty(PropDef.prototype, "canCauseSideEffects", {
                get: function () {
                    return this._canCauseSideEffects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "dataDictionaryKey", {
                get: function () {
                    return this._dataDictionaryKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "elementType", {
                get: function () {
                    return this._elementType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBarcodeType", {
                get: function () {
                    return this.type &&
                        this.type === 'STRING' &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_BARCODE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBinaryType", {
                get: function () {
                    return this.isLargeBinaryType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBooleanType", {
                get: function () {
                    return this.type && this.type === 'BOOLEAN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isCodeRefType", {
                get: function () {
                    return this.type && this.type === 'CODE_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateType", {
                get: function () {
                    return this.type && this.type === 'DATE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateTimeType", {
                get: function () {
                    return this.type && this.type === 'DATE_TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDecimalType", {
                get: function () {
                    return this.type && this.type === 'DECIMAL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDoubleType", {
                get: function () {
                    return this.type && this.type === 'DOUBLE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isEmailType", {
                get: function () {
                    return this.type && this.type === 'DATA_EMAIL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoFixType", {
                get: function () {
                    return this.type && this.type === 'GEO_FIX';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoLocationType", {
                get: function () {
                    return this.type && this.type === 'GEO_LOCATION';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isHTMLType", {
                get: function () {
                    return this.type && this.type === 'DATA_HTML';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isListType", {
                get: function () {
                    return this.type && this.type === 'LIST';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this.style &&
                        (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isIntType", {
                get: function () {
                    return this.type && this.type === 'INT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLargeBinaryType", {
                get: function () {
                    return this.type &&
                        this.type === 'com.dgoi.core.domain.BinaryRef' &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_LARGEBINARY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLongType", {
                get: function () {
                    return this.type && this.type === 'LONG';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isMoneyType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_MONEY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isNumericType", {
                get: function () {
                    return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isObjRefType", {
                get: function () {
                    return this.type && this.type === 'OBJ_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPasswordType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_PASSWORD';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPercentType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_PERCENT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isStringType", {
                get: function () {
                    return this.type && this.type === 'STRING';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTelephoneType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_TELEPHONE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTextBlock", {
                get: function () {
                    return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTimeType", {
                get: function () {
                    return this.type && this.type === 'TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isUnformattedNumericType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isURLType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_URL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "maintainable", {
                get: function () {
                    return this._maintainable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presLength", {
                get: function () {
                    return this._presLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presScale", {
                get: function () {
                    return this._presScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propertyLength", {
                get: function () {
                    return this._propertyLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propertyScale", {
                get: function () {
                    return this._propertyScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "writeEnabled", {
                get: function () {
                    return this._writeEnabled;
                },
                enumerable: true,
                configurable: true
            });
            PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
            PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
            return PropDef;
        })();
        dialog.PropDef = PropDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
