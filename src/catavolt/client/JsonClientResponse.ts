import {Log, StringDictionary} from "../util";
import {ClientResponse} from "./ClientResponse";

export class JsonClientResponse extends ClientResponse<StringDictionary | Array<any>> {

    constructor(value: StringDictionary | Array<any>, statusCode: number) {
        Log.debug(`JsonClientResponse: [status]:${statusCode} [body]:${Log.prettyPrint(value)}`);
        super(value, statusCode);
    }

}
