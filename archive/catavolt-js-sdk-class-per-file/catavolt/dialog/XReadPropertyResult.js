/**
 * Created by rburson on 4/1/15.
 */
export class XReadPropertyResult {
    constructor(dialogProperties, hasMore, data, dataLength) {
        this.dialogProperties = dialogProperties;
        this.hasMore = hasMore;
        this.data = data;
        this.dataLength = dataLength;
    }
}
