import {ClientResponse} from "./ClientResponse";

export class BlobClientResponse extends ClientResponse<Blob> {

    constructor(value: Blob, statusCode: number) {
        super(value, statusCode);
    }

}
