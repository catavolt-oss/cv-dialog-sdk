/**
 * Created by rburson on 3/30/15.
 */

export interface Binary {

}



export class EncodedBinary implements Binary {

    constructor(private _data:string) {
    }

    get data():string {
        return this._data;
    }

}