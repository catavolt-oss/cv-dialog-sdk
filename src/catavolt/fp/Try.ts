/**
 * Created by rburson on 3/5/15.
 */

///<reference path="references.ts"/>

module catavolt.fp {

    export class Try<A> {

        static flatten<A>(tryList:Array<Try<A>>):Try<Array<A>> {
            var successes = [];
            var failures = [];
            tryList.forEach((t:Try<A>)=>{
                if(t.isFailure) {
                   failures.push(t);
                } else {
                    if(Array.isArray(t.success) && Try.isListOfTry(<any>t.success)){
                        var flattened = Try.flatten(<any>t.success);
                        if(flattened.isFailure) {
                           failures.push(flattened.failure);
                        } else {
                           successes.push(flattened.success);
                        }
                    } else {
                        successes.push(t.success);
                    }
                }
            });
            if(failures.length > 0) {
                return new Failure<Array<A>>(failures);
            } else {
                return new Success(successes);
            }
        }

        private static isListOfTry(list:Array<any>):boolean {
            return list.every((value)=>{ return (value instanceof Try); });
        }

        bind<B>(f:TryFn<A,B>): Try<B> {
            return this.isFailure ? new Failure<B>(this.failure) : f(this.success);
        }

        get failure()  {
            return null;
        }

        get isFailure() : boolean {
            return false;
        }

        get isSuccess() : boolean {
            return false;
        }

        map<B>(f:MapFn<A,B>): Try<B> {
            return this.isFailure ? new Failure<B>(this.failure) : new Success<B>(f(this.success));
        }

        get success() : A {
            return null;
        }
    }
}