/**
 * Created by rburson on 4/27/15.
 */

import {PropDef} from "./PropDef";
import {ObjectRef} from "./ObjectRef";
import {CodeRef} from "./CodeRef";
import {GeoFix} from "./GeoFix";
import {GeoLocation} from "./GeoLocation";

export class PropFormatter {

    static formatForRead(prop:any, propDef:PropDef):string {
        return 'R:' + prop ? PropFormatter.toString(prop) : '';
    }

    static formatForWrite(prop:any, propDef:PropDef):string {
        return prop ? PropFormatter.toString(prop) : '';
    }

    static parse(value:string, propDef:PropDef) {

        var propValue:any = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        } else if (propDef.isLongType) {
            propValue = Number(value);
        } else if (propDef.isBooleanType) {
            if(typeof value === 'string') {
                propValue = value !== 'false';
            } else {
                propValue = !!value;
            }
            /*
             @TODO learn more about these date strings. if they are intended to be UTC we'll need to make sure
             'UTC' is appended to the end of the string before creation
             */
        } else if (propDef.isDateType) {
            propValue = new Date(value);
        } else if (propDef.isDateTimeType) {
            propValue = new Date(value);
        } else if (propDef.isTimeType) {
            propValue = new Date(value);
        } else if (propDef.isObjRefType) {
            propValue = ObjectRef.fromFormattedValue(value);
        } else if (propDef.isCodeRefType) {
            propValue = CodeRef.fromFormattedValue(value);
        } else if (propDef.isGeoFixType) {
            propValue = GeoFix.fromFormattedValue(value);
        } else if (propDef.isGeoLocationType) {
            propValue = GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    }

    static toString(o:any):string {
        if (typeof o === 'number') {
            return String(o);
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toUTCString();
            } else if (o instanceof CodeRef) {
                return o.toString();
            } else if (o instanceof ObjectRef) {
                return o.toString();
            } else if (o instanceof GeoFix) {
                return o.toString();
            } else if (o instanceof GeoLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }
}
