/**
 * Created by rburson on 3/5/15.
 */

import {Try} from './Try'

export class Success<A> extends Try<A> {

    constructor(private _value:A) {
        super();
    }

    get isSuccess():boolean {
        return true;
    }

    get success():A {
        return this._value;
    }

}
