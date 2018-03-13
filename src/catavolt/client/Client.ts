import { StringDictionary } from '../util';
import { BlobClientResponse } from './BlobClientResponse';
import { JsonClientResponse } from './JsonClientResponse';
import {ReadableClientResponse} from "./ReadableClientResponse";
import { TextClientResponse } from './TextClientResponse';
import { VoidClientResponse } from './VoidClientResponse';

export interface Client {
    lastActivity: Date;

    getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse>;

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse>;

    openStream(baseUrl: string, resourcePath?: string): Promise<ReadableClientResponse>;

    postMultipart<T>(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse>;

    getJson(baseUrl: string, resourcePath: string, queryParams?: StringDictionary): Promise<JsonClientResponse>;

    postJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse>;

    putJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse>;

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse>;

    setClientMode(clientMode: ClientMode);
}

export enum ClientMode {
    ONLINE,
    OFFLINE
}
