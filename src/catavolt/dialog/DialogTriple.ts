/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>

module catavolt.dialog {

    export class DialogTriple {

        public static extractList<A>(jsonObject:StringDictionary, Ltype:string, extractor:MapFn<any,Try<A>>) {
            var result:Try<Array<A>>;
            if (jsonObject) {
                var lt = jsonObject['WS_LTYPE'];
                if (Ltype === lt) {
                    if (jsonObject['values']) {
                        var realValues:Array<A> = [];
                        var values:Array<any> = jsonObject['values'];
                        for (var elem in values) {
                            var extdValue:Try<A> = extractor(elem);
                            if (extdValue.isFailure) {
                                result = new Failure<Array<A>>(extdValue.failure);
                                break;
                            }
                            realValues.push(extdValue.success);
                        }
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

        public static extractRedirection(jsonObject:StringDictionary, Otype:string): Try<Redirection> {
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

        public static extractTriple<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<Either<Redirection,A>> {
            return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
        }

        public static extractValue<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
            return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
        }

        public static extractValueIgnoringRedirection<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
            return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
        }


        private static _extractTriple<A>(jsonObject: StringDictionary,
                                        OType:string,
                                        ignoreRedirection: boolean,
                                        extractor: TryClosure<A>): Try<Either<Redirection,A>>{

            var result:Try<Either<Redirection,A>>;
            if(!jsonObject) {
                return new Failure<Either<Redirection,A>>('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + OType + ' because json object is null');
            } else {
                var ot:string = jsonObject['WS_OTYPE'];
                if(!ot || OType !== ot) {
                    result = new Failure<Either<Redirection,A>>('DialogTriple:extractTriple: expected O_TYPE ' + OType + ' but found ' + ot);
                } else {
                    if(jsonObject['exception']) {
                        var dialogException:DialogException = jsonObject['exception'];
                        result = new Failure<Either<Redirection,A>>(dialogException);
                    } else if (jsonObject['redirection'] && !ignoreRedirection){
                        var drt:Try<Redirection> = Redirection.fromWSRedirection(jsonObject);
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
                                    OType:string,
                                    ignoreRedirection:boolean,
                                    extractor: TryClosure<A>): Try<A> {


            var tripleTry = DialogTriple._extractTriple(jsonObject, OType, ignoreRedirection, extractor);
            var result:Try<A>;
            if(tripleTry.isFailure) {
               result = new Failure<A>(tripleTry.failure);
            } else {
                var triple:Either<Redirection,A> = tripleTry.success;
                if(triple.isLeft){
                    result = new Failure<A>('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + OType);
                } else {
                    result = new Success<A>(triple.right);
                }
            }
            return result;

        }
    }
}