/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../references.ts"/>

module catavolt.fp {

    export class Failure<A> extends Try<A>{

        constructor(private error) {
            super();
            console.log("test");
        }

        failure()  {
            return this.error;
        }

        isFailure() : boolean {
            return true;
        }

    }
}