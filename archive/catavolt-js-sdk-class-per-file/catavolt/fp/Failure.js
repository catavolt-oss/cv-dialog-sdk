import { Try } from './Try';
export class Failure extends Try {
    constructor(_error) {
        super();
        this._error = _error;
    }
    get failure() {
        return this._error;
    }
    get isFailure() {
        return true;
    }
}
//# sourceMappingURL=Failure.js.map