/**
 * Created by rburson on 4/1/15.
 */

import {StringDictionary} from "../util/Types";

export class XReadPropertyResult {
    constructor(public dialogProperties:StringDictionary,
                public hasMore:boolean,
                public data:string,
                public dataLength:number) {
    }
}
