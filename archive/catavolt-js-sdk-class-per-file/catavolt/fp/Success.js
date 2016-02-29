/**
 * Created by rburson on 3/5/15.
 */
import { Try } from './Try';
export class Success extends Try {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get isSuccess() {
        return true;
    }
    get success() {
        return this._value;
    }
}
