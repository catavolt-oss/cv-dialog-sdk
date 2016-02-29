/**
 * Created by rburson on 4/1/15.
 */

import {Try} from "../fp/Try";
import {PropDef} from "./PropDef";
import {SortPropDef} from "./SortPropDef";
import {DialogTriple} from "./DialogTriple";
import {OType} from "./OType";
import {EntityRecDef} from "./EntityRecDef";
import {Success} from "../fp/Success";
import {XOpenDialogModelResult} from "./XOpenDialogModelResult";

export class XOpenQueryModelResult implements XOpenDialogModelResult {

    static fromWS(otype:string, jsonObj):Try<XOpenQueryModelResult> {

        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];

        return DialogTriple.fromListOfWSDialogObject<PropDef>(queryRecDefJson['propertyDefs']
            , 'WSPropertyDef', OType.factoryFn).bind((propDefs:Array<PropDef>)=> {
            var entityRecDef = new EntityRecDef(propDefs);
            return DialogTriple.fromListOfWSDialogObject<SortPropDef>(queryRecDefJson['sortPropertyDefs'],
                'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=> {
                return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    }

    constructor(public entityRecDef:EntityRecDef,
                public sortPropertyDef:Array<SortPropDef>,
                public defaultActionId:string) {
    }
}
