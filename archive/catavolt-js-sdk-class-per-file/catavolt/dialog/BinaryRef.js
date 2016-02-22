/**
 * Created by rburson on 4/4/15.
 */
import { Base64 } from "../util/Base64";
import { Success } from "../fp/Success";
export class BinaryRef {
    constructor(_settings) {
        this._settings = _settings;
    }
    static fromWSValue(encodedValue, settings) {
        if (encodedValue && encodedValue.length > 0) {
            return new Success(new InlineBinaryRef(Base64.decode(encodedValue), settings));
        }
        else {
            return new Success(new ObjectBinaryRef(settings));
        }
    }
    get settings() {
        return this._settings;
    }
}
export class InlineBinaryRef extends BinaryRef {
    constructor(_inlineData, settings) {
        super(settings);
        this._inlineData = _inlineData;
    }
    /* Base64 encoded data */
    get inlineData() {
        return this._inlineData;
    }
    toString() {
        return this._inlineData;
    }
}
class ObjectBinaryRef extends BinaryRef {
    constructor(settings) {
        super(settings);
    }
}
