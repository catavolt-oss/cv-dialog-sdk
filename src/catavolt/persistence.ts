
import {StringDictionary} from "./util";
import {
    BlobClientResponse, Client, ClientMode, JsonClientResponse, TextClientResponse,
    VoidClientResponse
} from "./client"
import {FetchClient} from "./ws";
import {PersistenceTools} from "./persistence-tools";

export class PersistentClient implements Client {

    private static ADD_TO_BRIEFCASE_ACTION_ID = 'alias_AddToBriefcase';
    private static BRIEFCASE_ACTION_ID = 'Briefcase';
    private static OPEN_ACTION_ID = 'open';
    private static ONLINE_PROPERTY_NAME = 'online';
    private static REFERRING_WORKBENCH_MODEL_TYPE = 'hxgn.api.dialog.ReferringWorkbench';
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

    private deconstructDialogPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            dialogId: resourcePathElems[5]
        }
    }

    private deconstructGetRecordPath(resourcePathElems: string[]): any {
        return {
            tenantId: resourcePathElems[1],
            sessionId: resourcePathElems[3],
            dialogId: resourcePathElems[5]
        }
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
            } else {
                return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`DELETE action is not valid while offline: ${resourcePath}`), 400));
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
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new BlobClientResponse(null, 400));
        }
        return this._fetchClient.getBlob(baseUrl, resourcePath);;
    }

    private getDialog(baseUrl: string, resourcePath: string, resourcePathElems: string[], queryParams?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructDialogPath(resourcePathElems);
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                const dialog = PersistenceTools.readDialogState(this._tenantId, this._userId, pathFields.dialogId);
                if (!dialog) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Offline dialog not found ${pathFields.dialogId}`), 404));
                } else {
                    resolve(new JsonClientResponse(dialog, 200));
                }
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                var dialog = <StringDictionary> jcr.value;
                const referringObject = dialog.referringObject;
                if (this.isWorkPackagesDialog(dialog)) {
                    dialog = this.patchWorkPackagesDialog(dialog);
                }
                // If a redirection object has been persisted, then also persist the dialog object.
                const redirection = PersistenceTools.readRedirectionState(this._tenantId, this._userId, dialog.id);
                if (redirection) {
                    PersistenceTools.writeDialogState(this._tenantId, this._userId, dialog);
                    PersistenceTools.writeAllDialogParentState(this._tenantId, this._userId, dialog);
                }
                return new JsonClientResponse(dialog, 200);
            }
            return response;
        });
    }

    getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        const resourcePathElems: string[] = resourcePath.split('/');
        if (PersistenceTools.isGetDialog(resourcePathElems)) {
            return this.getDialog(baseUrl, resourcePath, resourcePathElems, queryParams);
        } else if (PersistenceTools.isGetRedirection(resourcePathElems)) {
            return this.getRedirection(baseUrl, resourcePath, resourcePathElems, queryParams);
        } else if (PersistenceTools.isGetSession(resourcePathElems)) {
            return this.getSession(baseUrl, resourcePath, resourcePathElems, queryParams);
        } else if (PersistenceTools.isGetRecord(resourcePathElems)) {
            return this.getRecord(baseUrl, resourcePath, resourcePathElems, queryParams);
        }
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`GET action is not valid while offline: ${resourcePath}`), 400));
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    private getRecord(baseUrl: string, resourcePath: string, resourcePathElems: string[], queryParams?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructGetRecordPath(resourcePathElems);
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                const record = PersistenceTools.readRecordState(this._tenantId, this._userId, pathFields.dialogId);
                if (!record) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Offline record not found ${pathFields.dialogId}`), 404));
                } else {
                    resolve(new JsonClientResponse(record, 200));
                }
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                var record = <StringDictionary> jcr.value;
                const dialogId = pathFields.dialogId;
                var dialog = PersistenceTools.findRootDialogState(this._tenantId, this._userId, dialogId);
                // If we have persisted the dialog, we also need to persist the dialog records
                if (dialog) {
                    PersistenceTools.writeRecordState(this._tenantId, this._userId, dialogId, record);
                }
                return new JsonClientResponse(record, 200);
            }
            return response;
        });
    }

    private getRedirection(baseUrl: string, resourcePath: string, resourcePathElems: string[], queryParams?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`GET redirection is not valid while offline: ${resourcePath}`), 400));
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    private getSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], queryParams?: StringDictionary): Promise<JsonClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`GET session is not valid while offline: ${resourcePath}`), 400));
        }
        return this._fetchClient.getJson(baseUrl, resourcePath, queryParams);
    }

    getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new TextClientResponse(null, 400));
        }
        return this._fetchClient.getText(baseUrl, resourcePath);
    }

    private isWorkPackagesDialog(dialog: any): boolean {
        const referringObject = dialog.referringObject;
        return referringObject &&
            referringObject.type === PersistentClient.REFERRING_WORKBENCH_MODEL_TYPE &&
            referringObject.actionId === PersistentClient.WORK_PACKAGES_ACTION_ID;
    }

    private patchWorkPackagesDialog(dialog: StringDictionary): StringDictionary {
        const workPackagesTableDialog = dialog.children[0];
        const propertyDefs = workPackagesTableDialog.recordDef.propertyDefs;
        propertyDefs.push({
            "writeAllowed": false,
            "propertyName": "briefcase",
            "canCauseSideEffects": false,
            "upperCaseOnly": false,
            "propertyType": "boolean",
            "type": "hxgn.api.dialog.PropertyDef",
            "writeEnabled": false
        });
        const columns = workPackagesTableDialog.view.columns;
        columns.push({
            "propertyName": "briefcase",
            "heading": "Briefcase",
            "type": "hxgn.api.dialog.Column"
        });
        return dialog;
    }

    private patchWorkPackagesRecordSet(dialog: any, recordSet: any): any {
        const records = recordSet.records;
        if (records) {
            for (let r of records) {
                const briefcaseField = {
                  "name": "briefcase",
                  "annotations": [],
                  "type": "hxgn.api.dialog.Property",
                  "value": false
                }
                r.properties.push(briefcaseField);
            }
        }
        return recordSet;
    }

    private makeNullRedirectionId(): string {
        return `null_redirection__offline_${Date.now()}`;
    }

    private postAddToBriefcaseMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const redirectionId = this.makeNullRedirectionId;
        const pathFields = this.deconstructMenuActionPath(resourcePathElems);
        if (!jsonBody || jsonBody.targets || jsonBody.targets.length === 0) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel('Selection required'), 400));
        }
        const actionParameters = {
            "targets": [jsonBody.targets],
            "type": "hxgn.api.dialog.ActionParameters"
        };
        const nullRedirection = {
            "tenantId": this._tenantId,
            "referringObject": {
                "dialogMode": "LIST",
                "dialogProperties": {
                    "globalRefresh": "true",
                    "localRefresh": "true",
                    "dialogAlias": "Workpackage_AddToBriefcase"
                },
                "actionId": PersistentClient.ADD_TO_BRIEFCASE_ACTION_ID,
                "type": "hxgn.api.dialog.ReferringDialog",
                "dialogId": pathFields.actionId
            },
            "sessionId": pathFields.sessionId,
            "id": redirectionId,
            "type": "hxgn.api.dialog.NullRedirection"
        };

        // tenants/hexagonsdaop/sessions/6222484894295291067_2119522777_505_-1224984819/dialogs/4/actions/open
        // return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);

        console.log('Adding work package to briefcase - request path: ' + resourcePath);
        console.log('Adding work package to briefcase - request body: ' + JSON.stringify(jsonBody));
        return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
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
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`POST action is not valid while offline: ${resourcePath}`), 400));
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    private postMenuAction(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructMenuActionPath(resourcePathElems);
        const redirectionId = this.makeNullRedirectionId();
        const nullRedirection = {
            "tenantId": this._tenantId,
            "referringObject": {
                "dialogMode": "READ",
                "dialogProperties": {
                    "globalRefresh": "true",
                    "localRefresh": "true"
                },
                "actionId": pathFields.actionId,
                "type": "hxgn.api.dialog.ReferringDialog",
                "dialogId": pathFields.dialogId,
            },
            "sessionId": pathFields.sessionId,
            "id": redirectionId,
            "type": "hxgn.api.dialog.NullRedirection"
        }
        return new Promise<JsonClientResponse>((resolve, reject) => {
            if (pathFields.actionId === 'alias_EnterOfflineMode') {
                const briefcaseRecord = this.readBriefcaseRecord();
                if (!briefcaseRecord) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Briefcase not found'), 400));
                }
                PersistenceTools.updateRecordPropertyValue(briefcaseRecord, PersistentClient.ONLINE_PROPERTY_NAME, false);
                this._clientMode = ClientMode.OFFLINE;
                resolve(new JsonClientResponse(nullRedirection, 303));
            } else if (pathFields.actionId === 'alias_ExitOfflineMode') {
                const briefcaseRecord = this.readBriefcaseRecord();
                if (!briefcaseRecord) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel('Briefcase not found'), 400));
                }
                PersistenceTools.updateRecordPropertyValue(briefcaseRecord, PersistentClient.ONLINE_PROPERTY_NAME, true);
                this._clientMode = ClientMode.ONLINE;
                resolve(new JsonClientResponse(nullRedirection, 303));
            } else {
                resolve(this._fetchClient.postJson(baseUrl, resourcePath, jsonBody));
            }
        });
    }

    postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new VoidClientResponse(400));
        }
        return this._fetchClient.postMultipart(baseUrl, resourcePath, formData);;
    }

    private postRecords(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructPostRecordsPath(resourcePathElems);
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                const recordSet = PersistenceTools.readRecordSetState(this._tenantId, this._userId, pathFields.dialogId);
                if (!recordSet) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Offline record set not found ${pathFields.dialogId}`), 404));
                } else {
                    resolve(new JsonClientResponse(recordSet, 200));
                }
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                var recordSet = <StringDictionary> jcr.value;
                const dialogId = pathFields.dialogId;
                var dialog = PersistenceTools.findRootDialogState(this._tenantId, this._userId, dialogId);
                // If we have persisted the dialog, we also need to persist the dialog records
                if (dialog) {
                    if (this.isWorkPackagesDialog(dialog)) {
                        recordSet = this.patchWorkPackagesRecordSet(dialog, recordSet);
                    }
                    PersistenceTools.writeRecordSetState(this._tenantId, this._userId, dialogId, recordSet);
                }
                return new JsonClientResponse(recordSet, 200);
            }
            return response;
        });
    }

    /*
    * TODO: Refactor this into persistence-tools as a general method when discriminator and ids can be parameterized
    */
    private readBriefcaseRecord(): StringDictionary {
        // FIND DIALOG ID
        const briefcaseNavigationKey = `workbench_${PersistentClient.SDA_WORKBENCH_ID}->${PersistentClient.BRIEFCASE_ACTION_ID}`;
        const briefcaseNavigation = PersistenceTools.readNavigationState(this._tenantId, this._userId, briefcaseNavigationKey);
        if (briefcaseNavigation) {
            const redirectionId = briefcaseNavigation.redirectionId;
            const dialog = PersistenceTools.readDialogState(this._tenantId, this._userId, redirectionId);
            var briefcaseRecordDialogId = null;
            const dialogChildren = dialog.children;
            if (dialogChildren) {
                for (let child of dialogChildren) {
                    // TODO: We need a better discriminator technique for reading record(s) for a
                    // particular dialog.
                    if ((child.businessClassName as String).endsWith('briefcase')) {
                        briefcaseRecordDialogId = child.id;
                        break;
                    }
                }
            }
            // READ RECORD
            if (briefcaseRecordDialogId) {
                return PersistenceTools.readRecordState(this._tenantId, this._userId, briefcaseRecordDialogId);
            }
        }
        return null;
    }

    /*
    * TODO: Refactor this into persistence-tools as a general method when discriminator and ids can be parameterized
    */
    private writeBriefcaseRecord(briefcaseRecord: any) {
        // FIND DIALOG ID
        const briefcaseNavigationKey = `workbench_${PersistentClient.SDA_WORKBENCH_ID}->${PersistentClient.BRIEFCASE_ACTION_ID}`;
        const briefcaseNavigation = PersistenceTools.readNavigationState(this._tenantId, this._userId, briefcaseNavigationKey);
        if (briefcaseNavigation) {
            const redirectionId = briefcaseNavigation.redirectionId;
            const dialog = PersistenceTools.readDialogState(this._tenantId, this._userId, redirectionId);
            var briefcaseRecordDialogId = null;
            const dialogChildren = dialog.children;
            if (dialogChildren) {
                for (let child of dialogChildren) {
                    // TODO: We need a better discriminator technique for reading record(s) for a
                    // particular dialog.
                    if ((child.businessClassName as String).endsWith('briefcase')) {
                        briefcaseRecordDialogId = child.id;
                        break;
                    }
                }
            }
            // WRITE RECORD
            if (briefcaseRecordDialogId) {
                PersistenceTools.writeRecordState(this._tenantId, this._userId, briefcaseRecordDialogId, briefcaseRecord);
            }
        }
    }

    private postSession(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        this._tenantId = resourcePathElems[1];
        this._userId = jsonBody.userId;
        const briefcaseRecord = this.readBriefcaseRecord();
        if (briefcaseRecord) {
            const onlineProperty = PersistenceTools.findRecordProperty(briefcaseRecord, PersistentClient.ONLINE_PROPERTY_NAME);
            if (onlineProperty && !onlineProperty.value) {
                this._clientMode = ClientMode.OFFLINE;
            } else {
                this._clientMode = ClientMode.ONLINE;
            }
        }
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
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
            if (jcr.statusCode === 200) {
                const session = <StringDictionary> jcr.value;
//                PersistenceTools.deleteAllState(this._tenantId, this._userId);
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
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`Workbench action not valid while offline: ${pathFields.actionId}`), 400));
        }
        return this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
    }

    private postWorkbenchActionBriefcase(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this.postWorkbenchActionFromCache(baseUrl, resourcePath, resourcePathElems, jsonBody);
    }

    private postWorkbenchActionFromCache(baseUrl: string, resourcePath: string, resourcePathElems: string[], jsonBody: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = this.deconstructWorkbenchActionPath(resourcePathElems);
        const navigationKey = `workbench_${pathFields.workbenchId}->${pathFields.actionId}`;
        if (this._clientMode === ClientMode.OFFLINE) {
            return new Promise<JsonClientResponse>((resolve, reject) => {
                const navigation = PersistenceTools.readNavigationState(this._tenantId, this._userId, navigationKey);
                if (!navigation) {
                    resolve(new JsonClientResponse(this.createDialogMessageModel(`Navigation for offline ${pathFields.actionId} not found`), 404));
                } else {
                    const redirection = PersistenceTools.readRedirectionState(this._tenantId, this._userId, navigation.redirectionId);
                    if (!redirection) {
                        resolve(new JsonClientResponse(this.createDialogMessageModel(`Redirection for offline ${pathFields.actionId} not found`), 404));
                    } else {
                        resolve(new JsonClientResponse(redirection, 303));
                    }
                }
            });
        }
        let response: Promise<JsonClientResponse> = this._fetchClient.postJson(baseUrl, resourcePath, jsonBody);
        return response.then(jcr => {
            if (jcr.statusCode === 303) {
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
        if (this._clientMode === ClientMode.OFFLINE) {
            return Promise.resolve(new JsonClientResponse(this.createDialogMessageModel(`PUT action is not valid while offline: ${resourcePath}`), 400));
        }
        return this._fetchClient.putJson(baseUrl, resourcePath, jsonBody);
    }

    setClientMode(clientMode: ClientMode): void {
        this._clientMode = clientMode;
    }

}
