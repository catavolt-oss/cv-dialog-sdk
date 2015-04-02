/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class PropDef {

        static STYLE_INLINE_MEDIA = "inlineMedia";
        static STYLE_INLINE_MEDIA2 = "Image/Video";

        constructor(private _name:string,
                    private _type:string,
                    private _elementType:string,
                    private _style:string,
                    private _propertyLength:number,
                    private _propertyScale:number,
                    private _presLength:number,
                    private _presScale:number,
                    private _dataDictionaryKey:string,
                    private _maintainable:boolean,
                    private _writeEnabled:boolean,
                    private _canCauseSideEffects:boolean) {
        }

        get canCauseSideEffects():boolean {
            return this._canCauseSideEffects;
        }

        get dataDictionaryKey():string {
            return this._dataDictionaryKey;
        }

        get elementType():string {
            return this._elementType;
        }

        get isBarcodeType():boolean {
            return this.type &&
                this.type === 'STRING' &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_BARCODE';
        }

        get isBinaryType():boolean {
            return this.isLargeBinaryType;
        }

        get isBooleanType():boolean {
            return this.type && this.type === 'BOOLEAN';
        }

        get isCodeRefType():boolean {
            return this.type && this.type === 'CODE_REF';
        }

        get isDateType():boolean {
            return this.type && this.type === 'DATE';
        }

        get isDateTimeType():boolean {
            return this.type && this.type === 'DATE_TIME';
        }

        get isDecimalType():boolean {
            return this.type && this.type === 'DECIMAL';
        }

        get isDoubleType():boolean {
            return this.type && this.type === 'DOUBLE';
        }

        get isEmailType():boolean {
            return this.type && this.type === 'DATA_EMAIL';
        }

        get isGeoFixType():boolean {
            return this.type && this.type === 'GEO_FIX';
        }

        get isGeoLocationType():boolean {
            return this.type && this.type === 'GEO_LOCATION';
        }

        get isHTMLType():boolean {
            return this.type && this.type === 'DATA_HTML';
        }

        get isListType():boolean {
            return this.type && this.type === 'LIST';
        }

        get isInlineMediaStyle():boolean {
            return this.style &&
                (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
        }

        get isIntType():boolean {
            return this.type && this.type === 'INT';
        }

        get isLargeBinaryType():boolean {
            return this.type &&
                this.type === 'com.dgoi.core.domain.BinaryRef' &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_LARGEBINARY';
        }

        get isLongType():boolean {
            return this.type && this.type === 'LONG';
        }

        get isMoneyType():boolean {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_MONEY';
        }

        get isNumericType():boolean {
            return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
         }

        get isObjRefType():boolean {
            return this.type && this.type === 'OBJ_REF';
        }

        get isPasswordType():boolean {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_PASSWORD';
        }

        get isPercentType():boolean {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_PERCENT';
        }

        get isStringType():boolean {
            return this.type && this.type === 'STRING';
        }

        get isTelephoneType():boolean {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_TELEPHONE';
        }

        get isTextBlock():boolean {
            return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
        }

        get isTimeType():boolean {
            return this.type && this.type === 'TIME';
        }

        get isUnformattedNumericType():boolean {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
        }

        get isURLType():boolean {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_URL';
        }

        get maintainable():boolean {
            return this._maintainable;
        }

        get name():string {
            return this._name;
        }

        get presLength():number {
            return this._presLength;
        }

        get presScale():number {
            return this._presScale;
        }

        get propLength():number {
            return this._propertyLength;
        }

        get propScale():number {
            return this._propertyScale;
        }

        get style():string {
            return this._style;
        }

        get type():string {
            return this._type;
        }

        get writeEnabled():boolean {
            return this._writeEnabled;
        }



    }
}