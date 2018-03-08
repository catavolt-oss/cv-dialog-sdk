import { DataUrl } from '../util';
import { TypeNames } from './types';

export class LargeProperty {
    private static DEFAULT_MIME_TYPE = 'application/octet-stream';

    constructor(
        readonly encodedData: string,
        readonly contentType?: string,
        readonly hasMore: boolean = false,
        readonly type: string = TypeNames.LargePropertyTypeName,
        readonly url?: string
    ) {}

    get isLoaded(): boolean {
        return !!this.url || !this.hasMore;
    }

    get mimeType(): string {
        return this.contentType || LargeProperty.DEFAULT_MIME_TYPE;
    }

    public toUrl(): string {
        if (this.isLoaded) {
            if (this.url) {
                return this.url;
            } else {
                return DataUrl.createDataUrl(this.mimeType, this.encodedData);
            }
        } else {
            throw new Error('LargeProperty::toUrl: encodedData is not yet loaded');
        }
    }

    public asNewLargeProperty(encodedData: string, hasMore = false): LargeProperty {
        return new LargeProperty(encodedData, this.contentType, hasMore, this.type, this.url);
    }
}
