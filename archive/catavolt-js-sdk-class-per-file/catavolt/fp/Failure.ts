
import {Try} from './Try';

export class Failure<A> extends Try<A> {

    constructor(private _error) {
        super();
    }

    get failure() {
        return this._error;
    }

    get isFailure():boolean {
        return true;
    }

}