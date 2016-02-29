/**
 * Created by rburson on 3/5/15.
 */
import { Success } from './Success';
import { Failure } from './Failure';
export class Try {
    static flatten(tryList) {
        var successes = [];
        var failures = [];
        tryList.forEach((t) => {
            if (t.isFailure) {
                failures.push(t.failure);
            }
            else {
                if (Array.isArray(t.success) && Try.isListOfTry(t.success)) {
                    var flattened = Try.flatten(t.success);
                    if (flattened.isFailure) {
                        failures.push(flattened.failure);
                    }
                    else {
                        successes.push(flattened.success);
                    }
                }
                else {
                    successes.push(t.success);
                }
            }
        });
        if (failures.length > 0) {
            return new Failure(failures);
        }
        else {
            return new Success(successes);
        }
    }
    static isListOfTry(list) {
        return list.every((value) => {
            return (value instanceof Try);
        });
    }
    bind(f) {
        return this.isFailure ? new Failure(this.failure) : f(this.success);
    }
    get failure() {
        return null;
    }
    get isFailure() {
        return false;
    }
    get isSuccess() {
        return false;
    }
    map(f) {
        return this.isFailure ? new Failure(this.failure) : new Success(f(this.success));
    }
    get success() {
        return null;
    }
}
