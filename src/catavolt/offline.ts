/**
 * Created by rburson on 10/16/17.
 */

import {StringDictionary, Log} from "./util";
import {JsonClientResponse, TextClientResponse, VoidClientResponse} from "./client"

export class OfflineClient {

    /* Last operation happened at this time */
    private _lastActivity: Date = new Date();

    get(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        let response:Promise<TextClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        let response:Promise<VoidClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }

    getJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        let response:Promise<JsonClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response:Promise<JsonClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response:Promise<JsonClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        let response:Promise<JsonClientResponse> = null;
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return response;
    }
}
