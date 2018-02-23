import {ClientResponse} from "./ClientResponse";

export class VoidClientResponse extends ClientResponse<void> {
    constructor(statusCode: number) {
        super(undefined, statusCode);
    }
}
