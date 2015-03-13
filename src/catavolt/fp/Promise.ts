/**
 * Created by rburson on 3/6/15.
 */
///<reference path="../fp/references.ts"/>

module catavolt.fp {

    export class Promise<A> {

        private _future: Future<A>;

        constructor(label:string) {
            this._future = Future.createFuture<A>(label);
        }

        /** --------------------- PUBLIC ------------------------------*/

        isComplete(): boolean { return this._future.isComplete; }

        complete(t: Try<A>): Promise<A> {
            this._future.complete(t);
            return this;
        }

        failure(error) {
            this.complete(new Failure<A>(error));
        }

        get future(): Future<A> {
            return this._future;
        }

        success(value: A) {
            this.complete(new Success<A>(value));
        }



    }
}
