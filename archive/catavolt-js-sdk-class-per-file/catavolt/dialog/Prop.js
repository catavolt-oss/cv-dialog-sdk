import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
import { Success } from "../fp/Success";
import { Failure } from "../fp/Failure";
import { GeoLocation } from "./GeoLocation";
import { DataAnno } from "./DataAnno";
import { BinaryRef } from "./BinaryRef";
import { ObjectRef } from "./ObjectRef";
import { CodeRef } from "./CodeRef";
import { GeoFix } from "./GeoFix";
export class Prop {
    constructor(_name, _value, _annos = []) {
        this._name = _name;
        this._value = _value;
        this._annos = _annos;
    }
    static fromListOfWSValue(values) {
        var props = [];
        values.forEach((v) => {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure)
                return new Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new Success(props);
    }
    static fromWSNameAndWSValue(name, value) {
        var propTry = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new Failure(propTry.failure);
        }
        return new Success(new Prop(name, propTry.success));
    }
    static fromWSNamesAndValues(names, values) {
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
    }
    static fromWSValue(value) {
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
                    var binaryRefTry = BinaryRef.fromWSValue(strVal, value['properties']);
                    if (binaryRefTry.isFailure)
                        return new Failure(binaryRefTry.failure);
                    propValue = binaryRefTry.success;
                }
                else if (PType === 'ObjectRef') {
                    propValue = ObjectRef.fromFormattedValue(strVal);
                }
                else if (PType === 'CodeRef') {
                    propValue = CodeRef.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoFix') {
                    propValue = GeoFix.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoLocation') {
                    propValue = GeoLocation.fromFormattedValue(strVal);
                }
                else {
                    return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                }
            }
        }
        return new Success(propValue);
    }
    static fromWS(otype, jsonObj) {
        var name = jsonObj['name'];
        var valueTry = Prop.fromWSValue(jsonObj['value']);
        if (valueTry.isFailure)
            return new Failure(valueTry.failure);
        var annos = null;
        if (jsonObj['annos']) {
            var annosListTry = DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', OType.factoryFn);
            if (annosListTry.isFailure)
                return new Failure(annosListTry.failure);
            annos = annosListTry.success;
        }
        return new Success(new Prop(name, valueTry.success, annos));
    }
    static toWSProperty(o) {
        if (typeof o === 'number') {
            return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
            }
            else if (o instanceof CodeRef) {
                return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
            }
            else if (o instanceof ObjectRef) {
                return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
            }
            else if (o instanceof GeoFix) {
                return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
            }
            else if (o instanceof GeoLocation) {
                return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
            }
        }
        else {
            return o;
        }
    }
    static toWSListOfProperties(list) {
        var result = { 'WS_LTYPE': 'Object' };
        var values = [];
        list.forEach((o) => {
            values.push(Prop.toWSProperty(o));
        });
        result['values'] = values;
        return result;
    }
    static toWSListOfString(list) {
        return { 'WS_LTYPE': 'String', 'values': list };
    }
    static toListOfWSProp(props) {
        var result = { 'WS_LTYPE': 'WSProp' };
        var values = [];
        props.forEach((prop) => {
            values.push(prop.toWS());
        });
        result['values'] = values;
        return result;
    }
    get annos() {
        return this._annos;
    }
    equals(prop) {
        return this.name === prop.name && this.value === prop.value;
    }
    get backgroundColor() {
        return DataAnno.backgroundColor(this.annos);
    }
    get foregroundColor() {
        return DataAnno.foregroundColor(this.annos);
    }
    get imageName() {
        return DataAnno.imageName(this.annos);
    }
    get imagePlacement() {
        return DataAnno.imagePlacement(this.annos);
    }
    get isBoldText() {
        return DataAnno.isBoldText(this.annos);
    }
    get isItalicText() {
        return DataAnno.isItalicText(this.annos);
    }
    get isPlacementCenter() {
        return DataAnno.isPlacementCenter(this.annos);
    }
    get isPlacementLeft() {
        return DataAnno.isPlacementLeft(this.annos);
    }
    get isPlacementRight() {
        return DataAnno.isPlacementRight(this.annos);
    }
    get isPlacementStretchUnder() {
        return DataAnno.isPlacementStretchUnder(this.annos);
    }
    get isPlacementUnder() {
        return DataAnno.isPlacementUnder(this.annos);
    }
    get isUnderline() {
        return DataAnno.isUnderlineText(this.annos);
    }
    get name() {
        return this._name;
    }
    get overrideText() {
        return DataAnno.overrideText(this.annos);
    }
    get tipText() {
        return DataAnno.tipText(this.annos);
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    toWS() {
        var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
        if (this.annos) {
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        }
        return result;
    }
}
//# sourceMappingURL=Prop.js.map