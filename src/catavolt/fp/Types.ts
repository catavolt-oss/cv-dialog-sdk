/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.fp {

    export interface TryClosure<A> { (): Try<A>; }
    export interface TryFn<A,B> { (value:A): Try<B>; }
    export interface CompletionListener<A> { (t:Try<A>):void; }
    export interface FailureListener { (failure):void; }
    export interface FutureFn<A,B> { (value:A):Future<B>; }
    export interface MapFn<A,B> { (value:A):B; }
    export interface SuccessListener<A> { (success:A):void; }

}