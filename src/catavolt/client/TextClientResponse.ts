import {ClientResponse} from "./ClientResponse";

export class TextClientResponse extends ClientResponse<string> {

    constructor(value: string, statusCode: number) {
        super(value, statusCode);
    }

}
