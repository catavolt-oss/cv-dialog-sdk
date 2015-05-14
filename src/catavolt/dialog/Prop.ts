/**
 * Created by rburson on 4/2/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class Prop {

        static fromListOfWSValue(values:Array<any>):Try<Array<any>> {
           var props = [];
           values.forEach((v)=>{
               var propTry = Prop.fromWSValue(v);
               if(propTry.isFailure) return new Failure(propTry.failure);
               props.push(propTry.success);
           });
            return new Success(props);
        }

        static fromWSNameAndWSValue(name:string, value:any):Try<Prop> {
            var propTry:Try<any> = Prop.fromWSValue(value);
            if(propTry.isFailure) {
                return new Failure<Prop>(propTry.failure);
            }
            return new Success<Prop>(new Prop(name, propTry.success));
        }

        static fromWSNamesAndValues(names:Array<string>, values:Array<any>):Try<Array<Prop>> {
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
            if(value && 'object' === typeof value) {
                var PType = value['WS_PTYPE'];
                var strVal = value['value'];
                if(PType) {
                    if (PType === 'Decimal') {
                        propValue = Number(strVal);
                    /*
                        @TODO learn more about these date strings. if they are intended to be UTC we'll need to make sure
                        'UTC' is appended to the end of the string before creation
                    */
                    } else if (PType === 'Date') {
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

        static fromWS(otype:string, jsonObj):Try<Prop> {
            var name:string = jsonObj['name'];
            var valueTry = Prop.fromWSValue(jsonObj['value']);
            if(valueTry.isFailure) return new Failure<Prop>(valueTry.failure);
            var annos:Array<DataAnno> = null;
            if(jsonObj['annos']) {
                var annosListTry:Try<Array<DataAnno>> =
                    DialogTriple.fromListOfWSDialogObject<DataAnno>(jsonObj['annos'], 'WSDataAnno', OType.factoryFn);
                if(annosListTry.isFailure) return new Failure<Prop>(annosListTry.failure);
                annos = annosListTry.success;
            }
            return new Success(new Prop(name, valueTry.success, annos));
        }

        static toWSProperty(o:any) {
           if (typeof o === 'number') {
              return {'WS_PTYPE':'Decimal', 'value':String(o)};
           } else if (typeof o === 'object') {
               if(o instanceof Date) {
                   return {'WS_PTYPE':'DateTime', 'value':o.toUTCString()};
               } else if (o instanceof CodeRef) {
                   return {'WS_PTYPE':'CodeRef', 'value':o.toString()};
               } else if (o instanceof ObjectRef) {
                   return {'WS_PTYPE':'ObjectRef', 'value':o.toString()};
               } else if (o instanceof GeoFix) {
                   return {'WS_PTYPE':'GeoFix', 'value':o.toString()};
               } else if (o instanceof GeoLocation) {
                   return {'WS_PTYPE':'GeoLocation', 'value':o.toString()};
               }
           } else {
              return o;
           }
        }

        static toWSListOfProperties(list:Array<any>):StringDictionary {
            var result:StringDictionary = {'WS_LTYPE':'Object'};
            var values = [];
            list.forEach((o)=>{ values.push(Prop.toWSProperty(o))});
            result['values'] = values;
            return result;
        }

        static toWSListOfString(list:Array<string>):StringDictionary {
            return {'WS_LTYPE':'String', 'values':list};
        }

        static toListOfWSProp(props:Array<Prop>):StringDictionary {
            var result:StringDictionary = {'WS_LTYPE':'WSProp'};
            var values = [];
            props.forEach((prop)=>{values.push(prop.toWS())});
            result['values'] = values;
            return result;
        }

        constructor(private _name:string, private _value:any, private _annos:Array<DataAnno> = []) {
        }

        get annos():Array<DataAnno> {
            return this._annos;
        }

        equals(prop:Prop):boolean {
            return this.name === prop.name && this.value === prop.value;
        }

        get backgroundColor():string {
            return DataAnno.backgroundColor(this.annos);
        }

        get foregroundColor():string {
            return DataAnno.foregroundColor(this.annos);
        }

        get imageName():string {
            return DataAnno.imageName(this.annos);
        }

        get imagePlacement():string {
            return DataAnno.imagePlacement(this.annos);
        }

        get isBoldText():boolean {
            return DataAnno.isBoldText(this.annos);
        }

        get isItalicText():boolean {
            return DataAnno.isItalicText(this.annos);
        }

        get isPlacementCenter():boolean {
            return DataAnno.isPlacementCenter(this.annos);
        }

        get isPlacementLeft():boolean {
            return DataAnno.isPlacementLeft(this.annos);
        }

        get isPlacementRight():boolean {
            return DataAnno.isPlacementRight(this.annos);
        }

        get isPlacementStretchUnder():boolean {
            return DataAnno.isPlacementStretchUnder(this.annos);
        }

        get isPlacementUnder():boolean {
            return DataAnno.isPlacementUnder(this.annos);
        }

        get isUnderline():boolean {
            return DataAnno.isUnderlineText(this.annos);
        }

        get name():string {
            return this._name;
        }

        get overrideText():string  {
            return DataAnno.overrideText(this.annos);
        }

        get tipText():string {
            return DataAnno.tipText(this.annos);
        }

        get value():any {
            return this._value;
        }

        toWS():StringDictionary {
            var result:StringDictionary = {'WS_OTYPE':'WSProp', 'name':this.name, 'value':Prop.toWSProperty(this.value)};
            if(this.annos) {
                result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
            }
            return result;
        }

    }

}