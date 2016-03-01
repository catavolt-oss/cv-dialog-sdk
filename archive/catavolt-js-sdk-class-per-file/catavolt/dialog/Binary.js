/**
 * Created by rburson on 3/30/15.
 */
import { DataUrl } from '../util/DataUrl';
/**
 * *********************************
 */
export class EncodedBinary {
    constructor(_data, _mimeType) {
        this._data = _data;
        this._mimeType = _mimeType;
    }
    get data() {
        return this._data;
    }
    get mimeType() {
        return this._mimeType || 'application/octet-stream';
    }
    toUrl() {
        return DataUrl.createDataUrl(this.mimeType, this.data);
    }
}
export class UrlBinary {
    constructor(_url) {
        this._url = _url;
    }
    get url() {
        return this._url;
    }
    toUrl() {
        return this.url;
    }
}
