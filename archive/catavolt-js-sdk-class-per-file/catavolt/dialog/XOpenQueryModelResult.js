/**
 * Created by rburson on 4/1/15.
 */
import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
import { EntityRecDef } from "./EntityRecDef";
import { Success } from "../fp/Success";
export class XOpenQueryModelResult {
    constructor(entityRecDef, sortPropertyDef, defaultActionId) {
        this.entityRecDef = entityRecDef;
        this.sortPropertyDef = sortPropertyDef;
        this.defaultActionId = defaultActionId;
    }
    static fromWS(otype, jsonObj) {
        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];
        return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', OType.factoryFn).bind((propDefs) => {
            var entityRecDef = new EntityRecDef(propDefs);
            return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs) => {
                return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    }
}
