
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

    private createDialogMessageModel(message: string) {
        return {type: 'hxgn.api.dialog.DialogMessage', message: message};
    }

    private createOfflineSessionNotFoundModel() {
        return this.createDialogMessageModel('Offline session not found');
    }

    private createSessionIdModel(sessionId: string) {
        return {type: 'hxgn.api.dialog.SessionId', sessionId: sessionId};
    }

    private deconstructMenuActionPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            dialogId: resourcePathElems[5],
            actionId: resourcePathElems[7]
        }
    }

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (this._clientMode === ClientMode.OFFLINE) {
            if (PersistenceTools.isDeleteSession(resourcePathElems)) {
                return this.deleteSession(baseUrl, resourcePath);
            }
        }
        return this._fetchClient.deleteJson(baseUrl, resourcePath);
    }

    private deleteSession(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        return new Promise<JsonClientResponse>((resolve, reject) => {
            const session = PersistenceTools.readSessionState(this._tenantId, this._userId);
            if (!session) {
                resolve(new JsonClientResponse(this.createOfflineSessionNotFoundModel(), 404));
            } else {
                this._tenantId = undefined;
                this._userId = undefined;
                const sessionIdModel = this.createSessionIdModel(session.id);
                resolve(new JsonClientResponse(sessionIdModel, 200));
            }
        });
    }

    getBlob(baseUrl:string, resourcePath?:string): Promise<BlobClientResponse> {
        return this._fetchClient.getBlob(baseUrl, resourcePath);;
    }

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        return this._fetchClient.getText(baseUrl, resourcePath);
    }

    getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (PersistenceTools.isPostSession(resourcePathElems)) {
            return this.postSession(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (PersistenceTools.isPostMenuAction(resourcePathElems)) {
            return this.postMenuAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (PersistenceTools.isPostWorkbenchAction(resourcePathElems)) {
            return this.postWorkbenchAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    private postMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const action = this.deconstructMenuActionPath(resourcePathElems);
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                if (action.actionId === 'alias_AddToBriefcase') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Offline action needs implementation: ' + action.actionId), 404));
                } else if (action.actionId === 'alias_EnterOfflineMode') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Current mode is already "Offline"'), 404));
                } else if (action.actionId === 'alias_ExitOfflineMode') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Exit Offline Mode needs implementation: ' + action.actionId), 404));
                }
            });
        }
        // if (action.actionId === 'alias_EnterOfflineMode') {
        //     return new Promise<JsonClientResponse>((resolve, reject) => {
        //         this.setClientMode(ClientMode.OFFLINE);
        //         const nullRedirection = {
        //             type: 'hxgn.api.dialog.NullRedirection'
        //         };
        //     });
        // } else if (action.actionId === 'alias_ExitOfflineMode') {
        // }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        return this._fetchClient.postMultipart(baseUrl, resourcePath, formData);;
    }

    private postSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                this._tenantId = resourcePathElems[1];
                this._userId = jsonBody.userId;
                const session = PersistenceTools.readSessionState(this._tenantId, this._userId);
                if (!session) {
                    resolve(new JsonClientResponse(this.createOfflineSessionNotFoundModel(), 404));
                } else {
                    resolve(new JsonClientResponse(session, 200));
                }
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode == 200) {
                const session = <StringDictionary> jcr.value;
                this._tenantId = session.tenantId;
                this._userId = session.userId;
                PersistenceTools.deleteAllState(this._tenantId, this._userId);
                PersistenceTools.writeSessionState(session);
            }
            return response;
        });
    }

    private postWorkbenchAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
    }

    setClientMode(clientMode: ClientMode): void {
        this._clientMode = clientMode;
    }

}
