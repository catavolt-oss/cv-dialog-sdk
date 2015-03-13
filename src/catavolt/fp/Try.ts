/**
 * Created by rburson on 3/5/15.
 */

module catavolt.fp {

    export class Try<A> {

        get failure()  {
            return null;
        }

        get isFailure() : boolean {
            return false;
        }

        get isSuccess() : boolean {
            return false;
        }

        get success() : A {
            return null;
        }
    }
}