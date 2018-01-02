
import {StringDictionary} from "./util";
import {
    BlobClientResponse, Client, ClientMode, JsonClientResponse, TextClientResponse,
    VoidClientResponse
} from "./client"
import {FetchClient} from "./ws";
import {PersistenceTools} from "./persistence-tools";

export class PersistentClient implements Client {

    private static EXAMPLE_NULL_REDIRECTION =
    {
        "tenantId": "hexagonsdaop",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogProperties": {
                "globalRefresh": "true",
                "localRefresh": "true",
                "dialogAlias": "Workpackage_AddToBriefcase"
            },
            "actionId": "alias_AddToBriefcase",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "4"
        },
        "sessionId": "6222484894295291067_12074678_437_-1483011052",
        "id": "null_redirection__1514686047327_13419658222327088",
        "type": "hxgn.api.dialog.NullRedirection"
    };

    private static SDA_WORKBENCH_ID = 'AAABACffAAAAACe2';
    private static WORK_PACKAGES_ACTION_ID = 'WorkPackages';

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

    private deconstructPostRecordsPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            dialogId: resourcePathElems[5]
        }
    }

    private deconstructWorkbenchActionPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            workbenchId: resourcePathElems[5],
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

    private getDialog(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode == ClientMode.OFFLINE) {
            // Return WorkPackages from cache
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
        return response.then(jcr => {
            if (jcr.statusCode == 200) {
                const dialog = <StringDictionary> jcr.value;
                // If a redirection object has been persisted, then also persist the dialog object.
                const redirection = PersistenceTools.readRedirectionState(this._tenantId, this._userId, dialog.id);
                if (redirection) {
                    PersistenceTools.writeDialogState(this._tenantId, this._userId, dialog);
                    PersistenceTools.writeAllDialogParentState(this._tenantId, this._userId, dialog);
                }
            }
            return response;
        });
    }

    getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (PersistenceTools.isGetDialog(resourcePathElems)) {
            return this.getDialog(baseUrl, resourcePath, queryParams);
        } else if (PersistenceTools.isGetRedirection(resourcePathElems)) {
            return this.getRedirection(baseUrl, resourcePath, queryParams);
        } else if (PersistenceTools.isGetSession(resourcePathElems)) {
            return this.getSession(baseUrl, resourcePath, queryParams);
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    private getRedirection(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode == ClientMode.OFFLINE) {
            // Return redirections from cache
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    private getSession(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode == ClientMode.OFFLINE) {
            // Return session from cache
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        return this._fetchClient.getText(baseUrl, resourcePath);
    }

    postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (PersistenceTools.isPostSession(resourcePathElems)) {
            return this.postSession(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (PersistenceTools.isPostMenuAction(resourcePathElems)) {
            return this.postMenuAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (PersistenceTools.isPostWorkbenchAction(resourcePathElems)) {
            return this.postWorkbenchAction(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (PersistenceTools.isPostRecords(resourcePathElems)) {
            return this.postRecords(baseUrl, resourcePath, resourcePathElems, jsonBody);
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    private postMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructMenuActionPath(resourcePathElems);
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                if (pathFields.actionId === 'alias_AddToBriefcase') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Offline action needs implementation: ' + pathFields.actionId), 404));
                } else if (pathFields.actionId === 'alias_EnterOfflineMode') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Current mode is already "Offline"'), 404));
                } else if (pathFields.actionId === 'alias_ExitOfflineMode') {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Exit Offline Mode needs implementation: ' + pathFields.actionId), 404));
                }
            });
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        return this._fetchClient.postMultipart(baseUrl, resourcePath, formData);;
    }

    private postRecords(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructPostRecordsPath(resourcePathElems);
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode == 200) {
                const dialogId = pathFields.dialogId
                var dialog = null;
                const parentId = PersistenceTools.readDialogParentState(this._tenantId, this._userId, dialogId);
                if (!parentId) {
                    dialog = PersistenceTools.readDialogState(this._tenantId, this._userId, dialogId);
                }
                if (parentId || dialog) {
                    const recordSet = <StringDictionary> jcr.value;
                    PersistenceTools.writeRecordSetState(this._tenantId, this._userId, dialogId, recordSet);
                }
            }
            return response;
        });
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
        const pathFields = this.deconstructWorkbenchActionPath(resourcePathElems);
        if (pathFields.actionId === 'WorkPackages') {
            return this.postWorkbenchActionWorkPackages(baseUrl, resourcePath, resourcePathElems, jsonBody);
        } else if (pathFields.actionId === 'Briefcase') {
            return this.postWorkbenchActionBriefcase(baseUrl, resourcePath, resourcePathElems, jsonBody);
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    private postWorkbenchActionBriefcase(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this.postWorkbenchActionFromCache(baseUrl, resourcePath, resourcePathElems, jsonBody);
    }

    private postWorkbenchActionFromCache(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructWorkbenchActionPath(resourcePathElems);
        const navigationKey = `workbench_${pathFields.workbenchId}->${pathFields.actionId}`;
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                const navigation = PersistenceTools.readNavigationState(this._tenantId, this._userId, navigationKey);
                if (!navigation) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Navigation for offline ${pathFields.actionId} not found`), 404));
                    return;
                }
                const redirection = PersistenceTools.readRedirectionState(this._tenantId, this._userId, navigation.redirectionId);
                if (!redirection) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Redirection for offline ${pathFields.actionId} not found`), 404));
                    return;
                }
                return new JsonClientResponse(redirection, 303);
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode == 303) {
                const redirection = <StringDictionary> jcr.value;
                const previousNavigation = PersistenceTools.readNavigationState(this._tenantId, this._userId, navigationKey);
                if (previousNavigation) {
                    PersistenceTools.deleteAllDialogState(this._tenantId, this._userId, previousNavigation.redirectionId);
                }
                const navigation = {
                    id: navigationKey,
                    redirectionId: redirection.id
                };
                PersistenceTools.writeNavigationState(this._tenantId, this._userId, navigation);
                PersistenceTools.writeRedirectionState(this._tenantId, this._userId, redirection);
            }
            return response;
        });
    }

    private postWorkbenchActionWorkPackages(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this.postWorkbenchActionFromCache(baseUrl, resourcePath, resourcePathElems, jsonBody);
    }

    putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
    }

    setClientMode(clientMode: ClientMode): void {
        this._clientMode = clientMode;
    }

}
