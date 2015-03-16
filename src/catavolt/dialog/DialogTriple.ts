/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>

module catavolt.dialog {

    export class DialogTriple {


        public static extractValue<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
            return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
        }

        private static extractTriple<A>(jsonObject: StringDictionary,
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


            var tripleTry = DialogTriple.extractTriple(jsonObject, OType, ignoreRedirection, extractor);
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