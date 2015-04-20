/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XOpenQueryModelResult implements XOpenDialogModelResult{

        static fromWS(otype:string, jsonObj):Try<Redirection> {

            var queryRecDefJson = jsonObj['queryRecordDef'];
            var defaultActionId = queryRecDefJson['defaultActionId'];

            return DialogTriple.fromListOfWSDialogObject<PropDef>(queryRecDefJson['propertyDefs']
                , 'WSPropertyDef', OType.factoryFn).bind((propDefs:Array<PropDef>)=>{
                    var entityRecDef = new EntityRecDef(propDefs);
                    return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'],
                        'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=>{
                            return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
                        });
            });
        }

        constructor(public entityRecDef:EntityRecDef,
                    public sortPropertyDef:Array<SortPropDef>,
                    public defaultActionId:string) {
        }
    }
}