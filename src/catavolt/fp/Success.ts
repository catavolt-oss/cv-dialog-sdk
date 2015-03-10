/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.fp {

    export class Success<A> extends Try<A>{

        constructor(private _value : A) {
            super();
        }

        isSuccess() : boolean {
            return true;
        }

        success() : A {
            return this._value;
        }

    }

}