import { Binary } from './Binary';

/**
 * Represents a remote binary
 */
export class UrlBinary implements Binary {
    constructor(private _url: string) {}

    get url(): string {
        return this._url;
    }

    /**
     * Returns a url that 'points to' the binary data
     * @returns {string}
     */
    public toUrl(): string {
        return this.url;
    }
}
