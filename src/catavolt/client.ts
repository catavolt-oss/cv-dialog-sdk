/**
 * Created by rburson on 10/16/17.
 */
import {StringDictionary, Log} from "./util";

export interface Client {

    get(baseUrl:string, resourcePath?:string):Promise<TextClientResponse>;
    postMultipart<T>(baseUrl:string, resourcePath:string, formData:FormData):Promise<VoidClientResponse>;

    getJson(baseUrl:string, resourcePath:string, queryParams?:StringDictionary):Promise<JsonClientResponse>;
    postJson(baseUrl:string, resourcePath:string, body?:StringDictionary):Promise<JsonClientResponse>;
    putJson(baseUrl:string, resourcePath:string, body?:StringDictionary):Promise<JsonClientResponse>;
    deleteJson(baseUrl:string, resourcePath:string):Promise<JsonClientResponse>;

    setClientMode(clientMode:ClientMode);
    lastActivity:Date;

}

export enum ClientMode { REMOTE, OFFLINE }

export abstract class ClientResponse<T> {

    constructor(readonly value:T,  readonly statusCode:number) {}

}

export class JsonClientResponse extends ClientResponse<StringDictionary | Array<any>> {

    constructor(value:StringDictionary | Array<any>, statusCode:number) {
        Log.debug(`JsonClientResponse: [status]:${statusCode} [body]:${Log.prettyPrint(value)}`);
        super(value, statusCode);
    }

}

export class TextClientResponse extends ClientResponse<string> {

    constructor(value:string, statusCode:number) {
        super(value, statusCode);
    }

}

export class VoidClientResponse extends ClientResponse<void> {
    constructor(statusCode:number) {
        super(undefined, statusCode);
    }
}
