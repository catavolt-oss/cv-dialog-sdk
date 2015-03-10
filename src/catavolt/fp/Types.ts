/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.fp {

    export interface TryClosure<A> { (): Try<A>; }
}