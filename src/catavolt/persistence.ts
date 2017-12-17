/**
State * Created by rburson on 10/16/17.
 */

import {StringDictionary} from "./util";
import {
    BlobClientResponse, Client, ClientMode, JsonClientResponse, TextClientResponse,
    VoidClientResponse
} from "./client"
import {FetchClient} from "./ws";
import {PersistenceTools} from "./persistence-tools";

export class PersistentClient implements Client {

    private _clientMode: ClientMode;
    private _fetchClient: FetchClient;
    private _tenantId: string;
    private _userId: string;

    constructor(clientMode: ClientMode = ClientMode.ONLINE) {
        this._clientMode = clientMode;
        this._fetchClient = new FetchClient();
        this._tenantId = undefined;
        this._userId = undefined;
    }

    /* Last operation happened at this time */
    private _lastActivity: Date = new Date();

    get lastActivity(): Date {
        return this._lastActivity;
    }

    getBlob(baseUrl:string, resourcePath?:string):Promise<BlobClientResponse> {
        let response: Promise<BlobClientResponse> = this._fetchClient.getBlob(baseUrl, resourcePath);
        return response;
    }

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        let response: Promise<TextClientResponse> = this._fetchClient.getText(baseUrl, resourcePath);
        return response;
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        let response: Promise<VoidClientResponse> = this._fetchClient.postMultipart(baseUrl, resourcePath, formData);
        return response;
    }

    getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
        const path: string[] = resourcePath.split('/');
        if (PersistenceTools.isGetDialog(path)) {
            response.then(jcr => {
                if (jcr.statusCode == 200) {
                    const dialog = <StringDictionary> jcr.value;
                    PersistenceTools.writeDialogState(this._tenantId, this._userId, dialog);
                }
            });
        }
        return response;
    }

    postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        const path: string[] = resourcePath.split('/');
        if (PersistenceTools.isPostSession(path)) {
            response.then(jcr => {
                if (jcr.statusCode == 200) {
                    const session = <StringDictionary> jcr.value;
                    this._tenantId = session.tenantId;
                    this._userId = session.userId;
                    PersistenceTools.deleteAllState(this._tenantId, this._userId);
                    PersistenceTools.writeSessionState(session);
                } else if (jcr.statusCode == 303) {
                    const redirection = <StringDictionary> jcr.value;
                    PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
                }
            });
        } else if (PersistenceTools.isPostMenuAction(path)) {
            response.then(jcr => {
                if (jcr.statusCode == 303) {
                    const redirection = <StringDictionary> jcr.value;
                    PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
                }
            });
        } else if (PersistenceTools.isPostWorkbenchAction(path)) {
            response.then(jcr => {
                if (jcr.statusCode == 303) {
                    const redirection = <StringDictionary> jcr.value;
                    PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
                }
            });
        }
        return response;
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
        return response;
    }

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.deleteJson(baseUrl, resourcePath);
        return response;
    }

    setClientMode(clientMode: ClientMode): void {
        this._clientMode = clientMode;
    }

}
