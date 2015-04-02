/**
 * Created by rburson on 4/2/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class Prop {

        constructor(private _name:string, private _value:any, private _annos:Array<DataAnno>) {
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