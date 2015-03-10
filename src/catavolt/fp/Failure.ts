/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.fp {

    export class Failure<A> extends Try<A>{

        constructor(private _error) {
            super();
            console.log("test");
        }

        failure()  {
            return this._error;
        }

        isFailure() : boolean {
            return true;
        }

    }
}