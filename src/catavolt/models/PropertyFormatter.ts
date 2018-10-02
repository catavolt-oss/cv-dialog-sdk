import moment from 'moment';
import numeral from 'numeral';
import { CatavoltApi } from '../dialog/CatavoltApi';
import { CvLocale } from '../util/CvLocale';
import { CodeRef } from './CodeRef';
import { GpsReadingProperty } from './GpsReadingProperty';
import { MapLocationProperty } from './MapLocationProperty';
import { ObjectRef } from './ObjectRef';
import { Property } from './Property';
import { PropertyDef } from './PropertyDef';

// Chose the locales to load based on this list:
// https://stackoverflow.com/questions/9711066/most-common-locales-for-worldwide-compatibility
// Best effort for now.  Need to dynamically load these from Globalize???
import 'moment/locale/de';
import 'moment/locale/en-ca';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/pt';
import 'moment/locale/pt-br';
import 'moment/locale/ru';
import 'moment/locale/zh-cn';

// we must use these to prevent giving moment non-existent locales that cause it hurl in RN
// @see https://github.com/moment/moment/issues/3624#issuecomment-288713419
const supportedLocales = ['en', 'de', 'en-ca', 'en-gb', 'es', 'fr', 'it', 'ja', 'pt', 'pt-br', 'ru', 'zh-cn'];

import { DateTimeValue } from '../util/DateTimeValue';
import { DateValue } from '../util/DateValue';
import { TimeValue } from '../util/TimeValue';
/**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */
class PrivatePropFormats {
    public static decimalFormat: string[] = [
        '0,0',
        '0,0.0',
        '0,0.00',
        '0,0.000',
        '0,0.0000',
        '0,0.00000',
        '0,0.000000',
        '0,0.0000000',
        '0,0.00000000',
        '0,0.000000000',
        '0,0.0000000000'
    ];
    public static decimalFormatGeneric: string = '0,0.[0000000000000000000000000]';
    public static moneyFormat: string[] = [
        '$0,0',
        '$0,0.0',
        '$0,0.00',
        '$0,0.000',
        '$0,0.0000',
        '$0,0.00000',
        '$0,0.000000',
        '$0,0.0000000',
        '$0,0.00000000',
        '$0,0.000000000',
        '$0,0.0000000000'
    ];
    public static moneyFormatGeneric: string = '$0,0.00[0000000000000000000000000]';
    public static percentFormat: string[] = [
        '0,0%',
        '0,0%',
        '0,0%',
        '0,0.0%',
        '0,0.00%',
        '0,0.000%',
        '0,0.0000%',
        '0,0.00000%',
        '0,0.000000%',
        '0,0.0000000%',
        '0,0.00000000%'
    ];
    public static percentFormatGeneric: string = '0,0.[0000000000000000000000000]%';
    public static wholeFormat: string = '0,0';
}

export class PropertyFormatter {
    private static _singleton: PropertyFormatter;
    // Default format for money at varying decimal lengths.
    // For numeral format options, see: http://numeraljs.com/
    public decimalFormat: string[];
    public decimalFormatGeneric: string;
    public moneyFormat: string[];
    public moneyFormatGeneric: string;
    public percentFormat: string[];
    public percentFormatGeneric: string;
    public wholeFormat: string;

    public static singleton(catavoltApi: CatavoltApi): PropertyFormatter {
        if (!PropertyFormatter._singleton) {
            PropertyFormatter._singleton = new PropertyFormatter(catavoltApi);
        }
        return PropertyFormatter._singleton;
    }

    private constructor(private _catavoltApi: CatavoltApi) {
        if (PropertyFormatter._singleton) {
            throw new Error('Singleton instance already created');
        }
        this.resetFormats();
        PropertyFormatter._singleton = this;
    }
    /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    public formatForRead(prop: Property, propDef: PropertyDef): string {
        if (prop === null || prop === undefined) {
            return '';
        } else {
            return this.formatValueForRead(prop.value, propDef);
        }
    }

    public formatValueForRead(value: any, propDef: PropertyDef) {
        const locale: CvLocale = this._catavoltApi.locale;
        const locales: string[] = [];
        locales.push(this.getSupportedLocale(locale.langCountryString));

        if (value === null || value === undefined) {
            return '';
        } else if ((propDef && propDef.isCodeRefType) || value instanceof CodeRef) {
            return (value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || value instanceof ObjectRef) {
            return (value as ObjectRef).description;
        } else if (propDef && propDef.isDateTimeType) {
            return moment(value as Date)
                .locale(locales)
                .format('lll');
        } else if ((propDef && propDef.isDateType) || value instanceof Date) {
            return moment(value as Date)
                .locale(locales)
                .format('l');
        } else if ((propDef && propDef.isTimeType) || value instanceof TimeValue) {
            return moment(value as TimeValue)
                .locale(locales)
                .format('LT');
        } else if (propDef && propDef.isPasswordType) {
            return (value as string).replace(/./g, '*');
        } else if ((propDef && propDef.isListType) || Array.isArray(value)) {
            return value.reduce((prev, current) => {
                return (prev ? prev + ', ' : '') + this.formatValueForRead(current, null);
            }, '');
        } else {
            return this.toString(value, propDef);
        }
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    public formatForWrite(prop: Property, propDef: PropertyDef): string {
        if (prop === null || prop === undefined || prop.value === null || prop.value === undefined) {
            return null;
        } else if ((propDef && propDef.isCodeRefType) || prop.value instanceof CodeRef) {
            return (prop.value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || prop.value instanceof ObjectRef) {
            return (prop.value as ObjectRef).description;
        } else {
            return this.toStringWrite(prop.value, propDef);
        }
    }

    /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value.
     * @param value
     * @param propDef
     * @returns {}
     */
    public parse(value: any, propDef: PropertyDef): any {
        let propValue: any = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        } else if (propDef.isLongType) {
            propValue = Number(value);
        } else if (propDef.isBooleanType) {
            if (typeof value === 'string') {
                propValue = value !== 'false';
            } else {
                propValue = !!value;
            }
        } else if (propDef.isDateType) {
            // this could be a DateValue, a Date, or a string
            if (value instanceof DateValue) {
                propValue = value;
            } else if (typeof value === 'object') {
                propValue = new DateValue(value);
            } else {
                // parse as local time
                propValue = new DateValue(moment(value).toDate());
            }
        } else if (propDef.isDateTimeType) {
            // this could be a DateTimeValue, a Date, or a string
            if (value instanceof DateTimeValue) {
                propValue = value;
            } else if (typeof value === 'object') {
                propValue = new DateTimeValue(value);
            } else {
                // parse as local time
                propValue = new DateTimeValue(moment(value).toDate());
            }
        } else if (propDef.isTimeType) {
            propValue = value instanceof TimeValue ? value : TimeValue.fromString(value);
        }
        return propValue;
    }

    public resetFormats(): void {
        this.decimalFormat = PrivatePropFormats.decimalFormat.slice(0);
        this.decimalFormatGeneric = PrivatePropFormats.decimalFormatGeneric;
        this.moneyFormat = PrivatePropFormats.moneyFormat.slice(0);
        this.moneyFormatGeneric = PrivatePropFormats.moneyFormatGeneric;
        this.percentFormat = PrivatePropFormats.percentFormat.slice(0);
        this.percentFormatGeneric = PrivatePropFormats.percentFormatGeneric;
        this.wholeFormat = PrivatePropFormats.wholeFormat;
    }

    public toString(o: any, propDef: PropertyDef): string {
        return this.toStringRead(o, propDef);
    }

    /**
     * Render this value as a string
     *
     * @param o
     * @param {PropertyDef} propDef
     * @returns {string}
     */
    public toStringRead(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number') {
            if (propDef && !propDef.isUnformattedNumericType) {
                if (propDef.isMoneyType) {
                    let f =
                        propDef.displayScale < this.moneyFormat.length
                            ? this.moneyFormat[propDef.displayScale]
                            : this.moneyFormatGeneric;
                    // If there is a currency symbol, remove it noting it's position pre/post
                    // Necessary because numeral will replace $ with the symbol based on the locale of the browser.
                    // This may be desired down the road, but for now, the server provides the symbol to use.
                    const atStart: boolean = f.length > 0 && f[0] === '$';
                    const atEnd: boolean = f.length > 0 && f[f.length - 1] === '$';
                    if (this._catavoltApi.currencySymbol) {
                        f = f.replace('$', ''); // Format this as a number, and slam in Extender currency symbol
                        let formatted = numeral(o).format(f);
                        if (atStart) {
                            formatted = this._catavoltApi.currencySymbol + formatted;
                        }
                        if (atEnd) {
                            formatted = formatted + this._catavoltApi.currencySymbol;
                        }
                        return formatted;
                    } else {
                        return numeral(o).format(f); // Should substitute browsers locale currency symbol
                    }
                } else if (propDef.isPercentType) {
                    const f =
                        propDef.displayScale < this.percentFormat.length
                            ? this.percentFormat[propDef.displayScale]
                            : this.percentFormatGeneric;
                    return numeral(o).format(f); // numeral accomplishs * 100, relevant if we use some other symbol
                } else if (propDef.isIntType || propDef.isLongType) {
                    return numeral(o).format(this.wholeFormat);
                } else if (propDef.isDecimalType || propDef.isDoubleType) {
                    const f =
                        propDef.displayScale < this.decimalFormat.length
                            ? this.decimalFormat[propDef.displayScale]
                            : this.decimalFormatGeneric;
                    return numeral(o).format(f);
                }
            } else {
                return String(o);
            }
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toISOString();
            } else if (o instanceof DateValue) {
                return (o as DateValue).dateObj.toISOString();
            } else if (o instanceof DateTimeValue) {
                return (o as DateTimeValue).dateObj.toISOString();
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else if (o instanceof CodeRef) {
                return o.toString();
            } else if (o instanceof ObjectRef) {
                return o.toString();
            } else if (o instanceof GpsReadingProperty) {
                return o.toString();
            } else if (o instanceof MapLocationProperty) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }

    public toStringWrite(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number' && propDef) {
            if (propDef.isMoneyType) {
                return o.toFixed(2);
            } else if (propDef.isIntType || propDef.isLongType) {
                return o.toFixed(0);
            } else if (propDef.isDecimalType || propDef.isDoubleType) {
                return o.toFixed(Math.max(2, (o.toString().split('.')[1] || []).length));
            }
        } else {
            return this.toStringRead(o, propDef);
        }
    }

    private getSupportedLocale(locale): string {
        if (supportedLocales.indexOf(locale)) {
            return locale;
        } else {
            const sepIndex = locale.indexOf('-');
            if (sepIndex > -1) {
                const lang = locale.substring(0, sepIndex);
                if (supportedLocales.indexOf(lang)) {
                    return lang;
                }
            }
            return this._catavoltApi.DEFAULT_LOCALE.language;
        }
    }
}
