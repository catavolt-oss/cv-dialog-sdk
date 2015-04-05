/**
 * Created by rburson on 4/2/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class Prop {

        static fromWSNameAndWSValue(name:string, value:any):Try<Prop> {
            var propTry:Try<any> = Prop.fromWSValue(value);
            if(propTry.isFailure) {
                return new Failure<Prop>(propTry.failure);
            }
            return new Success<Prop>(new Prop(name, propTry.success));
        }

        static fromWSNamesAndValues(names:Array<string>, values:Array<string>):Try<Array<Prop>> {
            if(names.length != values.length) {
                return new Failure<Array<Prop>>("Prop::fromWSNamesAndValues: names and values must be of same length");
            }
            var list:Array<Prop> = [];
            for(var i=0; i<names.length; i++) {
                var propTry:Try<Prop> = Prop.fromWSNameAndWSValue(names[i], values[i]);
                if(propTry.isFailure) {
                    return new Failure<Array<Prop>>(propTry.failure);
                }
                list.push(propTry.success);
            }
            return new Success<Array<Prop>>(list);
        }

        static fromWSValue(value:any):Try<any> {
            var propValue = value;
            if('object' === typeof value) {
                var PType = value['WS_PTYPE'];
                var strVal = value['value'];
                if(PType) {
                    /*
                        @TODO learn more about these date strings. if they are intended to be UTC we'll need to make sure
                        'UTC' is appended to the end of the string before creation
                     */
                    if (PType === 'Date') {
                        propValue = new Date(strVal);
                    } else if (PType === 'DateTime') {
                        propValue = new Date(strVal);
                    } else if (PType === 'Time') {
                        propValue = new Date(strVal);
                    } else if (PType === 'BinaryRef') {
                        var binaryRefTry = BinaryRef.fromWSValue(strVal, value['properties']);
                        if(binaryRefTry.isFailure) return new Failure(binaryRefTry.failure);
                        propValue = binaryRefTry.success;
                    } else if (PType === 'ObjectRef') {
                        propValue = ObjectRef.fromFormattedValue(strVal);
                    } else if (PType === 'CodeRef') {
                        propValue = CodeRef.fromFormattedValue(strVal);
                    } else if (PType === 'GeoFix') {
                        propValue = GeoFix.fromFormattedValue(strVal);
                    } else if (PType === 'GeoLocation') {
                        propValue = GeoLocation.fromFormattedValue(strVal);
                    } else {
                        return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                    }
                }
            }
            return new Success(propValue);
        }

        constructor(private _name:string, private _value:any, private _annos:Array<DataAnno> = []) {
        }

        get annos():Array<DataAnno> {
            return this._annos;
        }

        equals(prop:Prop):boolean {
            return this.name === prop.name && this.value === prop.value;
        }

        get name():string {
            return this._name;
        }

        get value():any {
            return this._value;
        }

    }

}