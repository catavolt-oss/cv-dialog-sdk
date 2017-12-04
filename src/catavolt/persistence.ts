/**
 * Created by rburson on 10/16/17.
 */

import {Log, StringDictionary} from "./util";
import {Client, ClientMode, JsonClientResponse, TextClientResponse, VoidClientResponse} from "./client"
import {FetchClient} from "./ws";

export class PersistentClient implements Client {

    /* Last operation happened at this time */
    private _lastActivity: Date = new Date();
    private _clientMode: ClientMode;
    private _fetchClient: FetchClient;

    constructor(clientMode:ClientMode = ClientMode.ONLINE) {
        this._clientMode = clientMode;
        this._fetchClient = new FetchClient();
    }

    get(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        Log.debug("BEGIN GETTING");
        let response: Promise<TextClientResponse> = this._fetchClient.get(baseUrl, resourcePath);
        Log.debug("END GETTING");
        return response;
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        Log.debug("BEGIN POST MULTIPART");
        let response: Promise<VoidClientResponse> = this._fetchClient.postMultipart(baseUrl, resourcePath, formData);
        Log.debug("END POST MULTIPART");
        return response;
    }

    getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        Log.debug("BEGIN GET JSON");
        let response: Promise<JsonClientResponse> = this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
        Log.debug("END GET JSON");
        return response;
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        Log.debug("BEGIN POST JSON");
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        Log.debug("END POST JSON");
        return response;
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        Log.debug("BEGIN PUT JSON");
        let response: Promise<JsonClientResponse> = this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
        Log.debug("END PUT JSON");
        return response;
    }

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        Log.debug("BEGIN DELETE JSON");
        let response: Promise<JsonClientResponse> = this._fetchClient.deleteJson(baseUrl, resourcePath);
        Log.debug("END DELETE JSON");
        return response;
    }

    setClientMode(clientMode: ClientMode): void {
        Log.debug("BEGIN SET CLIENT MODE");
        this._clientMode = clientMode;
        Log.debug("END SET CLIENT MODE");
    }

}
