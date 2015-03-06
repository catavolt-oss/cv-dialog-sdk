/**
 * Created by rburson on 3/5/15.
 */

module catavolt.fp {

    export class Try<A> {

        failure()  {
            return null;
        }

        isFailure() : boolean {
            return false;
        }

        isSuccess() : boolean {
            return false;
        }

        success() : A {
            return null;
        }
    }
}