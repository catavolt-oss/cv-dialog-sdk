/**
 * Created by rburson on 3/30/15.
 */

import {DataUrl} from '../util/DataUrl'

export interface Binary {
    toUrl():string;
}
/**
 * *********************************
 */

export class EncodedBinary implements Binary {

    constructor(private _data:string, private _mimeType?:string) {
    }

    get data():string {
        return this._data;
    }

    get mimeType():string {
        return this._mimeType || 'application/octet-stream';
    }

    toUrl():string {
        return DataUrl.createDataUrl(this.mimeType, this.data);
    }
}

export class UrlBinary implements Binary {

    constructor(private _url:string) {
    }

    get url():string {
        return this._url;
    }

    toUrl():string {
        return this.url;
    }
}