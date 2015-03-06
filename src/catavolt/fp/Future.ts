/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../references.ts"/>

import ArrayUtil = catavolt.util.ArrayUtil;
import Log = catavolt.util.Log;

module catavolt.fp {

    export class Future<A> {

        /** --------------------- PUBLIC STATIC ------------------------------*/

        static createCompletedFuture<A>(label:string, result:Try<A>): Future<A> {
            var f:Future<A> = new Future<A>(label);
            return f.complete(result);
        }

        static createFuture<A>(label:string): Future<A> {
            var f:Future<A> = new Future<A>(label);
            return f;
        }

        private completionListeners: Array<(t:Try<A>)=>void> = new Array();
        private result:Try<A>;

        /** --------------------- CONSTRUCTORS ------------------------------*/

        constructor(private label) { }

        /** --------------------- PUBLIC ------------------------------*/

        isComplete(): boolean { return !!this.result; }

        isCompleteWithFailure(): boolean { return !!this.result && this.result.isFailure(); }

        isCompleteWithSuccess(): boolean { return !!this.result && this.result.isSuccess(); }

        /*  TODO - figure out how to scope this at the 'module' level */
        complete(t: Try<A>): Future<A>{
            var notifyList:Array<(t:Try<A>)=>void> = new Array();
            if(t) {
                if (!this.result) {
                    this.result = t;
                    /* capture the listener set to prevent missing a notification */
                    notifyList = ArrayUtil.deepCopy(this.completionListeners);
                } else {
                    Log.error("Future::complete() : Future is already completed");
                }
                notifyList.forEach(
                    (listener:(t:Try<A>)=>void)=> {
                        listener(this.result);
                    }
                );
            } else {
                Log.error("Future::complete() : Can't complete Future with null result");
            }
            return this;
        }

    }
}