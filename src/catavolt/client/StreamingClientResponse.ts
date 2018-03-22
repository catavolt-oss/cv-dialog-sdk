import { StreamProducer } from '../io/StreamProducer';
import { ClientResponse } from './ClientResponse';

export class ReadableStreamClientResponse extends ClientResponse<ReadableStream> implements StreamProducer {
    private reader: ReadableStreamReader;

    constructor(value: ReadableStream, statusCode: number) {
        super(value, statusCode);
        this.reader = value.getReader();
    }

    public read(): Promise<{ done: boolean; value: any }> {
        return this.reader.read();
    }
}
