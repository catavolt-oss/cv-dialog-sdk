/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class XQueryResult {

        constructor(public entityRecs:Array<EntityRec>,
                    public entityRecDef:EntityRecDef,
                    public hasMore:boolean,
                    public sortPropDefs:Array<SortPropDef>,
                    public defaultActionId:string,
                    public dialogProps:StringDictionary) {}

        static fromWS<A>(otype:string, jsonObj):Try<A> {

            return DialogTriple.fromWSDialogObject<EntityRecDef>(jsonObj['queryRecordDef'],
                'WSQueryRecordDef', OType.factoryFn).bind((entityRecDef:EntityRecDef)=>{
                    var entityRecDefJson = jsonObj['queryRecordDef'];
                    var actionId:string = jsonObj['defaultActionId'];
                    DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'],
                        'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=>{
                            var queryRecsJson = jsonObj['queryRecords'];
                            if(queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord'){
                                return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                            }
                            var queryRecsValues:Array<StringDictionary> = queryRecsJson['values'];
                            for(var i = 0; i < queryRecsValues.length; i++) {
                                var queryRecValue = queryRecsValues[i];
                                if(queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                                    return new Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                                }
                                var objectId = queryRecValue['objectId'];
                                var recPropsObj:StringDictionary = queryRecValue['properties'];
                                if(recPropsObj['WS_LTYPE'] !== 'Object') {
                                    return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                                }
                                var recPropsObjValues:Array<any> = recPropsObj['values'];
                                var propsTry:Try<Array<Prop>> = Prop.fromWSNamesAndValues(entityRecDef.propN);

                            }
                    });

            });

        }

    }
}