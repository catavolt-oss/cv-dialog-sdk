/**
 * *****************************************************
 */

export class DataUrl {

    private _mimeType: string;
    private _data: string;

    private static PROTO_TOKEN: string = 'data:';
    private static ENCODING_TOKEN: string = ';base64,';

    public static createDataUrl(mimeType: string, encodedData: string): string {
        return DataUrl.PROTO_TOKEN + mimeType + DataUrl.ENCODING_TOKEN + encodedData;
    }

    public static getMimeType(dataUrl: string): string {
        const startIndex: number = dataUrl.indexOf(':');
        const endIndex: number = dataUrl.indexOf(';');
        if (startIndex > -1 && endIndex > startIndex) {
            return dataUrl.substring(startIndex + 1, endIndex);
        }
    }

    public static getEncodedData(dataUrl: string): string {
        const startIndex: number = dataUrl.indexOf(',');
        if (startIndex > -1) {
            return dataUrl.substring(startIndex + 1);
        }
    }

    constructor(dataUrl: string) {
        this._mimeType = DataUrl.getMimeType(dataUrl);
        this._data = DataUrl.getEncodedData(dataUrl);
    }

    get mimeType(): string {
        return this._mimeType;
    }

    get data(): string {
        return this._data;
    }


}
