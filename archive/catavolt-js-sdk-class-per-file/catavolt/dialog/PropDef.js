/**
 * Created by rburson on 4/1/15.
 */
export class PropDef {
    constructor(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
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
    get canCauseSideEffects() {
        return this._canCauseSideEffects;
    }
    get dataDictionaryKey() {
        return this._dataDictionaryKey;
    }
    get elementType() {
        return this._elementType;
    }
    get isBarcodeType() {
        return this.type &&
            this.type === 'STRING' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_BARCODE';
    }
    get isBinaryType() {
        return this.isLargeBinaryType;
    }
    get isBooleanType() {
        return this.type && this.type === 'BOOLEAN';
    }
    get isCodeRefType() {
        return this.type && this.type === 'CODE_REF';
    }
    get isDateType() {
        return this.type && this.type === 'DATE';
    }
    get isDateTimeType() {
        return this.type && this.type === 'DATE_TIME';
    }
    get isDecimalType() {
        return this.type && this.type === 'DECIMAL';
    }
    get isDoubleType() {
        return this.type && this.type === 'DOUBLE';
    }
    get isEmailType() {
        return this.type && this.type === 'DATA_EMAIL';
    }
    get isGeoFixType() {
        return this.type && this.type === 'GEO_FIX';
    }
    get isGeoLocationType() {
        return this.type && this.type === 'GEO_LOCATION';
    }
    get isHTMLType() {
        return this.type && this.type === 'DATA_HTML';
    }
    get isListType() {
        return this.type && this.type === 'LIST';
    }
    get isInlineMediaStyle() {
        return this.style &&
            (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }
    get isIntType() {
        return this.type && this.type === 'INT';
    }
    get isLargeBinaryType() {
        return this.type &&
            this.type === 'com.dgoi.core.domain.BinaryRef' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_LARGEBINARY';
    }
    get isLongType() {
        return this.type && this.type === 'LONG';
    }
    get isMoneyType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_MONEY';
    }
    get isNumericType() {
        return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
    }
    get isObjRefType() {
        return this.type && this.type === 'OBJ_REF';
    }
    get isPasswordType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PASSWORD';
    }
    get isPercentType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PERCENT';
    }
    get isStringType() {
        return this.type && this.type === 'STRING';
    }
    get isTelephoneType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_TELEPHONE';
    }
    get isTextBlock() {
        return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
    }
    get isTimeType() {
        return this.type && this.type === 'TIME';
    }
    get isUnformattedNumericType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
    }
    get isURLType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_URL';
    }
    get maintainable() {
        return this._maintainable;
    }
    get name() {
        return this._name;
    }
    get presLength() {
        return this._presLength;
    }
    get presScale() {
        return this._presScale;
    }
    get propertyLength() {
        return this._propertyLength;
    }
    get propertyScale() {
        return this._propertyScale;
    }
    get style() {
        return this._style;
    }
    get type() {
        return this._type;
    }
    get writeEnabled() {
        return this._writeEnabled;
    }
}
PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
