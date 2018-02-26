import {DataUrl} from "../util/DataUrl";
import {Binary} from "./Binary";

/**
 * Represents a base64 encoded binary
 */
export class EncodedBinary implements Binary {

    constructor(private _data: string, private _mimeType?: string) {
    }

    /**
     * Get the base64 encoded data
     * @returns {string}
     */
    get data(): string {
        return this._data;
    }

    /**
     * Get the mime-type
     * @returns {string|string}
     */
    get mimeType(): string {
        return this._mimeType || "application/octet-stream";
    }

    /**
     * Returns a 'data url' representation of this binary, including the encoded data
     * @returns {string}
     */
    public toUrl(): string {
        return DataUrl.createDataUrl(this.mimeType, this.data);
    }
}
