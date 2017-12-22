
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

    deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (PersistenceTools.isDeleteSession(resourcePathElems)) {
            return this.deleteSession(baseUrl, resourcePath, resourcePathElems);
        }
        return this._fetchClient.deleteJson(baseUrl, resourcePath);
    }

    private createDialogMessageModel(message: string) {
        return {type: 'hxgn.api.dialog.DialogMessage', message: message};
    }

    private createOfflineSessionNotFound() {
        return this.createDialogMessageModel('Offline session not found');
    }

    private createSessionIdModel(sessionId: string) {
        return {type: 'hxgn.api.dialog.SessionId', sessionId: sessionId};
    }

    private deleteOfflineSession(baseUrl: string, resourcePath: string, resourcePathElems: string[]): Promise<JsonClientResponse> {
        return new Promise<JsonClientResponse>((resolve, reject) => {
            const session = PersistenceTools.readSessionState(this._tenantId, this._userId);
            if (!session) {
                resolve(new JsonClientResponse(this.createOfflineSessionNotFound(), 404));
            } else {
                this._tenantId = undefined;
                this._userId = undefined;
                const sessionIdModel = this.createSessionIdModel(session.id);
                resolve(new JsonClientResponse(sessionIdModel, 200));
            }
        });
    }

    private deleteOnlineSession(baseUrl: string, resourcePath: string, resourcePathElems: string[]): Promise<JsonClientResponse> {
        return this._fetchClient.deleteJson(baseUrl, resourcePath);
    }

    private deleteSession(baseUrl: string, resourcePath: string, resourcePathElems: string[]): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return this.deleteOfflineSession(baseUrl, resourcePath, resourcePathElems);
        } else {
            return this.deleteOnlineSession(baseUrl, resourcePath, resourcePathElems);
        }
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

    private deconstructMenuActionPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            dialogId: resourcePathElems[5],
            actionId: resourcePathElems[7]
        }
    }

    private postMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return this.postOfflineMenuAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else {
            return this.postOnlineMenuAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        }
    }

    private postOfflineMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return new Promise<JsonClientResponse>((resolve, reject) => {
            const action = this.deconstructMenuActionPath(resourcePathElems);
            if (action.actionId === 'alias_AddToBriefcase') {
                console.log('>>>>>>>>> FOUND OFFLINE ACTION: ' + action.actionId);
            }
            resolve(new JsonClientResponse(this.createDialogMessageModel('Offline action needs implementation: ' + action.actionId), 404));
        });
    }

    private postOnlineMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode == 303) {
                const redirection = <StringDictionary> jcr.value;
                PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
            }
            return response;
        });
    }

    private postOfflineSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return new Promise<JsonClientResponse>((resolve, reject) => {
            this._tenantId = resourcePathElems[1];
            this._userId = jsonBody.userId;
            const session = PersistenceTools.readSessionState(this._tenantId, this._userId);
            if (!session) {
                resolve(new JsonClientResponse(this.createOfflineSessionNotFound(), 404));
            } else {
                resolve(new JsonClientResponse(session, 200));
            }
        });
    }

    private postOnlineSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
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
        return response;
    }

    private postSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return this.postOfflineSession(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else {
            return this.postOnlineSession(baseUrl, resourcePath, resourcePathElems, jsonBody);
        }
    }

    private postWorkbenchAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        response.then(jcr => {
            if (jcr.statusCode == 303) {
                const redirection = <StringDictionary> jcr.value;
                PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
            }
        });
        return response;
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        let response: Promise<JsonClientResponse> = this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
        return response;
    }

    setClientMode(clientMode: ClientMode): void {
        this._clientMode = clientMode;
    }

}
