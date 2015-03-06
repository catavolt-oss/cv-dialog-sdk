/**
 * Created by rburson on 3/6/15.
 */
///<reference path="../references.ts"/>

module catavolt.fp {

    export class Promise<A> {

        private future: Future<A>;

        constructor(label:string) {
            this.future = Future.createFuture<A>(label);
        }

        /** --------------------- PUBLIC ------------------------------*/

        isComplete(): boolean { return this.future.isComplete(); }

        complete(t: Try<A>): Promise<A> {
            this.future.complete(t);
            return this;
        }

        failure(error) {
            this.complete(new Failure<A>(error));
        }

        getFuture(): Future<A> {
            return this.future;
        }

        success(value: A) {
            this.complete(new Success<A>(value));
        }



    }
}
