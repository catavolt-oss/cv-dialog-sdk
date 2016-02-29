/**
 * Created by rburson on 4/1/15.
 */

export class SortPropDef {

    constructor(private _name:string, private _direction:string) {
    }

    get direction():string {
        return this._direction;
    }

    get name():string {
        return this._name;
    }

}
