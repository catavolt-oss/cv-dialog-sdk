import { CellValue } from './CellValue';
import { TypeNames } from './types';

/**
 * A property definition describes a particular value of a business entity. Business entities are transacted as records,
 * therefore properties and lists of properties are referred to as fields and records. Moreover, a list of property definitions
 * is referred to as a record definition and is the metadata describing the read/write capabilities of a specific dialog model
 * in use by a specific user in a specific workflow.
 * Contains information that 'defines' a property {@link Property} (name/value)
 * An instance of the {@link Property} contains the actual data value.
 */

export class PropertyDef {
    constructor(
        readonly canCauseSideEffects: boolean,
        readonly contentType: string,
        readonly displayLength: number,
        readonly displayScale: number,
        readonly format: string,
        readonly length: number,
        readonly propertyName: string,
        readonly propertyType: string,
        readonly scale: number,
        readonly semanticType: string,
        readonly upperCaseOnly: boolean,
        readonly writeAllowed: boolean,
        readonly writeEnabled: boolean
    ) {}

    get isBarcodeType(): boolean {
        return this.semanticType === 'BARCODE';
    }

    get isByteFormat(): boolean {
        return this.format === 'byte';
    }

    get isBooleanType(): boolean {
        return this.propertyType === 'boolean';
    }

    get isCodeRefType(): boolean {
        return this.format === 'code-ref'
    }

    get isDateType(): boolean {
        return this.format === 'date';
    }

    get isDateTimeType(): boolean {
        return this.format === 'date-time';
    }

    get isDecimalType(): boolean {
        return this.format === 'decimal';
    }

    get isDoubleType(): boolean {
        return this.format === 'double';
    }

    get isEmailType(): boolean {
        return this.semanticType === 'EMAIL';
    }

    get isFileAttachment(): boolean {
        return this.semanticType === 'FILE_UPLOAD';
    }

    get isFloatType(): boolean {
        return this.format === 'float';
    }

    get isGpsReadingType(): boolean {
        return this.propertyType === TypeNames.GpsReadingPropertyTypeName;
    }

    get isMapLocationType(): boolean {
        return this.propertyType === TypeNames.MapLocationPropertyTypeName;
    }

    get isHTMLType(): boolean {
        return this.semanticType === 'DATA_HTML';
    }

    // @TODO
    get isInlineMediaStyle(): boolean {
        return (
            this.semanticType === CellValue.STYLE_INLINE_MEDIA || this.semanticType === CellValue.STYLE_INLINE_MEDIA2
        );
    }

    get isListType(): boolean {
        return this.propertyType === 'array';
    }

    get isIntType(): boolean {
        return ['integer', 'int32', 'int64'].some(v => this.propertyType === v);
    }

    get isLongType(): boolean {
        return this.format === 'int64';
    }

    get isMoneyType(): boolean {
        return this.semanticType === 'MONEY';
    }

    get isNameType(): boolean {
        return this.semanticType === 'NAME';
    }

    get isNumericType(): boolean {
        return this.isDecimalType || this.isIntType || this.isDoubleType || this.isLongType || this.isFloatType;
    }

    get isLargePropertyType(): boolean {
        return this.semanticType === 'LARGE_PROPERTY' || this.isSignatureType;
    }

    get isObjRefType(): boolean {
        return this.format === 'object-ref';
    }

    get isPasswordType(): boolean {
        return this.format === 'password' || this.semanticType === 'PASSWORD';
    }

    get isPercentType(): boolean {
        return this.semanticType === 'PERCENTAGE';
    }

    get isReadOnly(): boolean {
        return !this.writeAllowed || !this.writeEnabled;
    }

    get isWritable(): boolean {
        return this.writeAllowed || this.writeEnabled;
    }

    get isSignatureType(): boolean {
        return this.semanticType === 'USER_SIGNATURE';
    }

    get isStringType(): boolean {
        return this.propertyType === 'string';
    }

    get isTelephoneType(): boolean {
        return this.semanticType === 'TELEPHONE';
    }

    get isTextBlock(): boolean {
        return this.semanticType === 'TEXT_BLOCK';
    }

    get isTimeType(): boolean {
        return this.format === 'time';
    }

    get isUnformattedNumericType(): boolean {
        return this.semanticType === 'UNFORMATTED';
    }

    get isURLType(): boolean {
        return this.semanticType === 'URL';
    }
}
