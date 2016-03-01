/**
 * Created by rburson on 2/22/16.
 */
/**
 * *****************************************************
 */
export class DataUrl {
    constructor(dataUrl) {
        this._mimeType = DataUrl.getMimeType(dataUrl);
        this._data = DataUrl.getEncodedData(dataUrl);
    }
    static createDataUrl(mimeType, encodedData) {
        return DataUrl.PROTO_TOKEN + mimeType + DataUrl.ENCODING_TOKEN + encodedData;
    }
    static getMimeType(dataUrl) {
        const startIndex = dataUrl.indexOf(':');
        const endIndex = dataUrl.indexOf(';');
        if (startIndex > -1 && endIndex > startIndex) {
            return dataUrl.substring(startIndex + 1, endIndex);
        }
    }
    static getEncodedData(dataUrl) {
        const startIndex = dataUrl.indexOf(',');
        if (startIndex > -1) {
            return dataUrl.substring(startIndex + 1);
        }
    }
    get mimeType() {
        return this._mimeType;
    }
    get data() {
        return this._data;
    }
}
DataUrl.PROTO_TOKEN = 'data:';
DataUrl.ENCODING_TOKEN = ';base64,';
