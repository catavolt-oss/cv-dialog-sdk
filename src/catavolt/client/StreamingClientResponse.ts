import { ClientResponse } from './ClientResponse';
import {ReadableClientResponse} from "./ReadableClientResponse";

export class ReadableStreamClientResponse extends ClientResponse<ReadableStream> implements ReadableClientResponse {

    private reader:ReadableStreamReader;

    constructor(value: ReadableStream, statusCode: number) {
        super(value, statusCode);
        this.reader = value.getReader();
    }

    public read(): Promise<{ done: boolean, value: any }> {
        return this.reader.read();
    }
}
