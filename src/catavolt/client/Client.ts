import {StringDictionary} from "../util";
import {VoidClientResponse} from "./VoidClientResponse";
import {JsonClientResponse} from "./JsonClientResponse";
import {BlobClientResponse} from "./BlobClientResponse";
import {TextClientResponse} from "./TextClientResponse";

export interface Client {

    getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse>;

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse>;

    postMultipart<T>(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse>;

    getJson(baseUrl: string, resourcePath: string, queryParams?: StringDictionary): Promise<JsonClientResponse>;

    postJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse>;

    putJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse>;

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse>;

    setClientMode(clientMode: ClientMode);

    lastActivity: Date;

}

export enum ClientMode { ONLINE, OFFLINE }
