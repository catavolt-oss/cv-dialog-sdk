/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class DialogTriple {

        static extractList<A>(jsonObject:StringDictionary, Ltype:string, extractor:MapFn<any,Try<A>>) {
            var result:Try<Array<A>>;
            if (jsonObject) {
                var lt = jsonObject['WS_LTYPE'];
                if (Ltype === lt) {
                    if (jsonObject['values']) {
                        var realValues:Array<A> = [];
                        var values:Array<any> = jsonObject['values'];
                        values.every((item)=> {
                            var extdValue:Try<A> = extractor(item);
                            if (extdValue.isFailure) {
                                result = new Failure<Array<A>>(extdValue.failure);
                                return false;
                            }
                            realValues.push(extdValue.success);
                            return true;
                        });
                        if (!result) {
                            result = new Success<Array<A>>(realValues);
                        }
                    } else {
                        result = new Failure<Array<A>>("DialogTriple::extractList: Values array not found");
                    }
                } else {
                    result = new Failure<Array<A>>("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
                }
            }
            return result;
        }

        static extractRedirection(jsonObject:StringDictionary, Otype:string): Try<Redirection> {
           var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false,
               ()=>{ return new Success(new NullRedirection({})); }
           );
            var answer:Try<Redirection>;
            if(tripleTry.isSuccess) {
                var triple = tripleTry.success;
                answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
            } else {
                answer = new Failure(tripleTry.failure);
            }
            return answer;
        }

        static extractTriple<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<Either<Redirection,A>> {
            return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
        }

        static extractValue<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
            return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
        }

        static extractValueIgnoringRedirection<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
            return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
        }

        static fromWSDialogObject<A>(obj, Otype:string, factoryFn?:(otype:string, jsonObj?)=>any, ignoreRedirection:boolean=false):Try<A> {

            if(!obj) {
                return new Failure<A>('DialogTriple::fromWSDialogObject: Cannot extract from null value')
            } else if (typeof obj !== 'object'){
                return new Success<A>(obj);
            }

            try {
                if (!factoryFn) {
                    /* Assume we're just going to coerce the exiting object */
                    return DialogTriple.extractValue(obj, Otype, ()=> {
                        return new Success<A>(obj);
                    });
                } else {
                    if(ignoreRedirection) {
                        return DialogTriple.extractValueIgnoringRedirection<A>(obj, Otype, ()=> {
                            return OType.deserializeObject<A>(obj, Otype, factoryFn);
                        });
                    }else{
                        return DialogTriple.extractValue<A>(obj, Otype, ()=> {
                            return OType.deserializeObject<A>(obj, Otype, factoryFn);
                        });
                    }
                }
            }catch(e) {
               return new Failure<A>('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
            }
        }

        static fromListOfWSDialogObject<A>(jsonObject:StringDictionary, Ltype:string, factoryFn?:(otype:string, jsonObj?)=>any, ignoreRedirection:boolean=false):Try<Array<A>> {
            return DialogTriple.extractList(jsonObject, Ltype,
                (value)=>{ return DialogTriple.fromWSDialogObject<A>(value, Ltype, factoryFn, ignoreRedirection); }
            );
        }

        static fromWSDialogObjectResult<A>(jsonObject:StringDictionary,
                                           resultOtype:string,
                                           targetOtype:string,
                                           objPropName:string,
                                           factoryFn?:(otype:string, jsonObj?)=>any):Try<A> {

            return DialogTriple.extractValue(jsonObject, resultOtype,
                ()=>{
                    return DialogTriple.fromWSDialogObject<A>(jsonObject[objPropName], targetOtype, factoryFn);
                }
            );
        }

        static fromWSDialogObjectResultWithFunc<A>(jsonObject:StringDictionary,
                                                   resultOtype:string,
                                                   objPropName:string,
                                                   fromWSObjectFunc:(o:StringDictionary)=>Try<A>): Try<A> {

            return DialogTriple.extractValue(jsonObject, resultOtype,
                ()=>{
                    return fromWSObjectFunc(jsonObject[objPropName]);
                }
            );
        }

        static fromListOfWSDialogObjectWithFunc<A>(jsonObject:StringDictionary,
                                                   Ltype:string,
                                                   fromWSObjectFunc:(o:StringDictionary)=>Try<A>): Try<Array<A>> {
            return DialogTriple.extractList(jsonObject, Ltype,
                (value)=>{ return fromWSObjectFunc(value); }
            );
        }


        private static _extractTriple<A>(jsonObject: StringDictionary,
                                        Otype:string,
                                        ignoreRedirection: boolean,
                                        extractor: TryClosure<A>): Try<Either<Redirection,A>>{

            var result:Try<Either<Redirection,A>>;
            if(!jsonObject) {
                return new Failure<Either<Redirection,A>>('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
            } else {
                var ot:string = jsonObject['WS_OTYPE'];
                if(!ot || Otype !== ot) {
                    result = new Failure<Either<Redirection,A>>('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                } else {
                    if(jsonObject['exception']) {
                        var dialogException:DialogException = jsonObject['exception'];
                        result = new Failure<Either<Redirection,A>>(dialogException);
                    } else if (jsonObject['redirection'] && !ignoreRedirection){
                        var drt:Try<Redirection> = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', OType.factoryFn);
                        if(drt.isFailure) {
                            result = new Failure<Either<Redirection,A>>(drt.failure);
                        } else {
                            result = new Success<Either<Redirection,A>>(Either.left<Redirection,A>(drt.success));
                        }
                    } else {
                        if (extractor) {
                           var valueTry:Try<A> = extractor();
                            if(valueTry.isFailure) {
                                result = new Failure<Either<Redirection,A>>(valueTry.failure);
                            } else {
                                result = new Success(Either.right(valueTry.success));
                            }
                        } else {
                            result = new Failure<Either<Redirection,A>>('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
                        }
                    }
                }
            }
            return result;
        }


        private static _extractValue<A>(jsonObject: StringDictionary,
                                    Otype:string,
                                    ignoreRedirection:boolean,
                                    extractor: TryClosure<A>): Try<A> {


            var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
            var result:Try<A>;
            if(tripleTry.isFailure) {
               result = new Failure<A>(tripleTry.failure);
            } else {
                var triple:Either<Redirection,A> = tripleTry.success;
                if(triple.isLeft){
                    result = new Failure<A>('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
                } else {
                    result = new Success<A>(triple.right);
                }
            }
            return result;

        }




    }
}