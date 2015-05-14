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

        static fromWS(otype:string, jsonObj):Try<XQueryResult> {

            return DialogTriple.fromWSDialogObject<EntityRecDef>(jsonObj['queryRecordDef'],
                'WSQueryRecordDef', OType.factoryFn).bind((entityRecDef:EntityRecDef)=>{
                    var entityRecDefJson = jsonObj['queryRecordDef'];
                    var actionId:string = jsonObj['defaultActionId'];
                    return DialogTriple.fromListOfWSDialogObject<SortPropDef>(entityRecDefJson['sortPropertyDefs'],
                        'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=>{
                            var queryRecsJson = jsonObj['queryRecords'];
                            if(queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord'){
                                return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                            }
                            var queryRecsValues:Array<StringDictionary> = queryRecsJson['values'];
                            var entityRecs:Array<EntityRec> = [];
                            for(var i = 0; i < queryRecsValues.length; i++) {
                                var queryRecValue = queryRecsValues[i];
                                if(queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                                    return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                                }
                                var objectId = queryRecValue['objectId'];
                                var recPropsObj:StringDictionary = queryRecValue['properties'];
                                if(recPropsObj['WS_LTYPE'] !== 'Object') {
                                    return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                                }
                                var recPropsObjValues:Array<any> = recPropsObj['values'];
                                var propsTry:Try<Array<Prop>> = Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                                if(propsTry.isFailure) return new Failure<XQueryResult>(propsTry.failure);
                                var props:Array<Prop> = propsTry.success;
                                if(queryRecValue['propertyAnnotations']) {
                                    var propAnnosJson = queryRecValue['propertyAnnotations'] ;
                                    var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                                    if(annotatedPropsTry.isFailure) return new Failure<XQueryResult>(annotatedPropsTry.failure);
                                    props = annotatedPropsTry.success;
                                }
                                var recAnnos:Array<DataAnno> = null;
                                if(queryRecValue['recordAnnotation']) {
                                    var recAnnosTry = DialogTriple.fromWSDialogObject<Array<DataAnno>>(queryRecValue['recordAnnotation'],
                                        'WSDataAnnotation', OType.factoryFn);
                                    if(recAnnosTry.isFailure) return new Failure<XQueryResult>(recAnnosTry.failure);
                                    recAnnos = recAnnosTry.success;
                                }
                                var entityRec:EntityRec = EntityRec.Util.newEntityRec(objectId, props, recAnnos);
                                entityRecs.push(entityRec);
                            }
                            var dialogProps:StringDictionary = jsonObj['dialogProperties'];
                            var hasMore:boolean = jsonObj['hasMore'];
                            return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs,
                                actionId, dialogProps));


                    });

            });

        }

    }
}