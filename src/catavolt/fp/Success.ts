/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../references.ts"/>

module catavolt.fp {

    export class Success<A> extends Try<A>{

        constructor(private value : A) {
            super();
        }

        isSuccess() : boolean {
            return true;
        }

        success() : A {
            return this.value;
        }

    }

}