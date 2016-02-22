/**
 * Created by rburson on 3/6/15.
 */
import { Future } from './Future';
import { Success } from './Success';
import { Failure } from './Failure';
export class Promise {
    constructor(label) {
        this._future = Future.createFuture(label);
    }
    /** --------------------- PUBLIC ------------------------------*/
    isComplete() {
        return this._future.isComplete;
    }
    complete(t) {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    }
    failure(error) {
        this.complete(new Failure(error));
    }
    get future() {
        return this._future;
    }
    success(value) {
        this.complete(new Success(value));
    }
}
