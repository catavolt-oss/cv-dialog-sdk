/**
 * Created by rburson on 3/5/15.
 */

module catavolt.fp {

    export class Try<A> {

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