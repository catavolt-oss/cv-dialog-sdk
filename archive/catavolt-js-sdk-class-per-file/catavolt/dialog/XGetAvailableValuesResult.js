/**
 * Created by rburson on 4/1/15.
 */
import { Success } from "../fp/Success";
import { Prop } from "./Prop";
export class XGetAvailableValuesResult {
    constructor(list) {
        this.list = list;
    }
    static fromWS(otype, jsonObj) {
        var listJson = jsonObj['list'];
        var valuesJson = listJson['values'];
        return Prop.fromListOfWSValue(valuesJson).bind((values) => {
            return new Success(new XGetAvailableValuesResult(values));
        });
    }
}
