/**
 * Created by rburson on 4/1/15.
 */

import {Success} from "../fp/Success";
import {Prop} from "./Prop";
import {Try} from "../fp/Try";

export class XGetAvailableValuesResult {

    static fromWS(otype:string, jsonObj):Try<XGetAvailableValuesResult> {
        var listJson = jsonObj['list'];
        var valuesJson:Array<any> = listJson['values'];
        return Prop.fromListOfWSValue(valuesJson).bind((values:Array<any>)=> {
            return new Success(new XGetAvailableValuesResult(values));
        });
    }

    constructor(public list:Array<any>) {
    }

}
