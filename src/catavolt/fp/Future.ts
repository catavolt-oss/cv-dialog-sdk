/**
 * Created by rburson on 3/5/15.
 */

///<reference path="../util/references.ts"/>

module catavolt.fp {

    export class Future<A> {

        /** --------------------- PUBLIC STATIC ------------------------------*/

        static createCompletedFuture<A>(label:string, result:Try<A>): Future<A> {
            var f:Future<A> = new Future<A>(label);
            return f.complete(result);
        }

        static createSuccessfulFuture<A>(label:string, value:A): Future<A> {
            return Future.createCompletedFuture(label, new Success<A>(value));
        }

        static createFailedFuture<A>(label:string, error):Future<A> {
            return Future.createCompletedFuture(label, new Failure<A>(error));
        }

        static createFuture<A>(label:string): Future<A> {
            var f:Future<A> = new Future<A>(label);
            return f;
        }

        static sequence<A>(seqOfFutures:Array<Future<A>>): Future<Array<Try<A>>> {
            var start:Future<Array<Try<A>>> = Future.createSuccessfulFuture<Array<Try<A>>>('Future::sequence/start', []);
            return seqOfFutures.reduce((seqFr:Future<Array<Try<A>>>, nextFr:Future<A>)=>{
               return seqFr.bind((seq:Array<Try<A>>)=>{
                   var pr = new Promise<Array<Try<A>>>('Future::sequence/nextFr');
                   nextFr.onComplete((t:Try<A>)=>{
                       seq.push(t);
                       pr.complete(new Success<Array<Try<A>>>(seq));
                   });
                   return pr.future;
               });
            }, start);
        }

        private _completionListeners: Array<(t:Try<A>)=>void> = new Array();
        private _result:Try<A>;

        /** --------------------- CONSTRUCTORS ------------------------------*/

        constructor(private _label) { }

        /** --------------------- PUBLIC ------------------------------*/

        bind<B>(f:FutureFn<A,B>):Future<B> {
            var p:Promise<B> = new Promise<B>('Future.bind:' + this._label);
            this.onComplete((t1:Try<A>)=>{
                if(t1.isFailure){
                    p.failure(t1.failure);
                } else {
                    var a:A = t1.success;
                    try {
                        var mb:Future<B> = f(a);
                        mb.onComplete((t2:Try<B>)=> {
                            p.complete(t2);
                        });
                    } catch (error) {
                        p.complete(new Failure<B>(error));
                    }
                }
            });
            return p.future;
        }

        get failure() { return this._result ? this._result.failure : null; }

        get isComplete(): boolean { return !!this._result; }

        get isCompleteWithFailure(): boolean { return !!this._result && this._result.isFailure; }

        get isCompleteWithSuccess(): boolean { return !!this._result && this._result.isSuccess; }

        map<B>(f:MapFn<A,B>):Future<B> {

            var p:Promise<B> = new Promise<B>('Future.map:' + this._label);
            this.onComplete((t1:Try<A>)=>{
              if(t1.isFailure){
                  p.failure(t1.failure);
              } else {
                  var a:A = t1.success;
                  try {
                      var b:B = f(a);
                      p.success(b);
                  }catch(error){
                      p.complete(new Failure<B>(error));
                  }
              }
            });
            return p.future;
        }

        onComplete(listener:CompletionListener<A>):void {
            this._result ? listener(this._result) : this._completionListeners.push(listener);
        }

        onFailure(listener:FailureListener): void {
            this.onComplete((t:Try<A>)=>{
                t.isFailure && listener(t.failure);
            });
        }

        onSuccess(listener:SuccessListener<A>):void {
            this.onComplete((t:Try<A>)=>{
                t.isSuccess &&  listener(t.success);
            });
        }

        get result():Try<A> { return this._result; }

        get success():A { return this._result ? this.result.success : null; }


        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility

        complete(t: Try<A>): Future<A>{
            var notifyList:Array<CompletionListener<A>> = new Array();
            //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
            if(t) {
                if (!this._result) {
                    this._result = t;
                    /* capture the listener set to prevent missing a notification */
                    notifyList = ArrayUtil.copy(this._completionListeners);
                } else {
                    Log.error("Future::complete() : Future " + this._label + " has already been completed");
                }
                notifyList.forEach(
                    (listener:CompletionListener<A>)=> {
                        listener(this._result);
                    }
                );
            } else {
                Log.error("Future::complete() : Can't complete Future with null result");
            }
            return this;
        }

    }
}