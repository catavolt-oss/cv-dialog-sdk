import {JsonClientResponse} from "../client/JsonClientResponse";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {FetchClient} from "../ws/FetchClient";
import {DialogRedirectionVisitor} from "./DialogRedirectionVisitor";
import {DialogRequest} from "./DialogRequest";
import {DialogVisitor} from "./DialogVisitor";
import {RecordSetVisitor} from "./RecordSetVisitor";
import {RecordVisitor} from "./RecordVisitor";

/**
 *
 */
export class DialogProxyTools {

    // Model Types
    private static ACTION_PARAMETERS_MODEL_TYPE = 'hxgn.api.dialog.ActionParameters';
    private static ANNOTATION_MODEL_TYPE = 'hxgn.api.dialog.Annotation';
    private static DIALOG_MESSAGE_MODEL_TYPE = 'hxgn.api.dialog.DialogMessage';
    private static EDITOR_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.EditorDialog';
    private static LOGIN_MODEL_TYPE = 'hxgn.api.dialog.Login';
    private static PROPERTY_MODEL_TYPE = 'hxgn.api.dialog.Property';
    private static PROPERTY_DEF_MODEL_TYPE = 'hxgn.api.dialog.PropertyDef';
    private static QUERY_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.QueryDialog';
    private static RECORD_MODEL_TYPE = 'hxgn.api.dialog.Record';
    private static RECORD_SET_MODEL_TYPE = 'hxgn.api.dialog.RecordSet';
    private static REFERRING_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.ReferringDialog';
    private static REFERRING_WORKBENCH_MODEL_TYPE = 'hxgn.api.dialog.ReferringWorkbench';
    private static SESSION_MODEL_TYPE = 'hxgn.api.dialog.Session';

    // Storage Keys
    private static DIALOG_STORAGE_KEY =      '${userId}.${tenantId}.${dialogId}.dialog';
    private static RECORD_SET_STORAGE_KEY =  '${userId}.${tenantId}.${dialogId}.recordset';
    private static RECORD_STORAGE_KEY =      '${userId}.${tenantId}.${dialogId}.record';
    private static REDIRECTION_STORAGE_KEY = '${userId}.${tenantId}.${stateId}.${actionId}.redirection';

    private static COMMON_FETCH_CLIENT = new FetchClient();

    public static async captureDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, dialogId: string): Promise<object> {
        const thisMethod = 'DialogProxyTools::captureDialog';
        // GET DIALOG //
        const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`;
        const dialogJcr = await DialogProxyTools.commonFetchClient().getJson(baseUrl, dialogPath);
        if (dialogJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting dialog ${dialogId}: ${dialogJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- dialog: ${JSON.stringify(dialogJcr.value)}`);
        // WRITE DIALOG //
        const dialogVisitor = new DialogVisitor(dialogJcr.value);
        const originalDialog = dialogVisitor.copyAsJsonObject();
        dialogVisitor.deriveDialogIdsFromDialogNameAndRecordIdRecursively();
        await this.writeDialog(userId, tenantId, dialogVisitor);
        return originalDialog;
    }

    public static async captureMenuActionRedirectionAndDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, dialogId: string, actionId: string, targetId: string): Promise<any> {
        const thisMethod = 'DialogProxyTools::captureMenuActionRedirectionAndDialog';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions/${actionId}`;
        Log.info(`${thisMethod} -- capturing menu redirection and dialog: ${resourcePath}`);
        // GET REDIRECTION //
        const actionParameters = {
            targets: [targetId],
            type: "hxgn.api.dialog.ActionParameters"
        };
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, actionParameters);
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting menu dialog ${dialogId} action ${actionId}: ${dialogRedirectionJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- menu action redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        // WRITE REDIRECTION //
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const originalDialogRedirection = dialogRedirectionVisitor.copyAsJsonObject();
        dialogRedirectionVisitor.deriveDialogIdsFromDialogNameAndRecordId();
        await this.writeDialogRedirection(userId, tenantId, dialogRedirectionVisitor.visitReferringDialogId(), actionId, dialogRedirectionVisitor);
        // GET DIALOG //
        const originalDialogId = originalDialogRedirection['dialogId'];
        const originalDialog = await this.captureDialog(userId, baseUrl, tenantId, sessionId, originalDialogId);
        return {originalDialogRedirection, originalDialog};
    }

    public static async captureWorkbenchActionRedirectionAndDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, workbenchId: string, actionId: string): Promise<any> {
        const thisMethod = 'DialogProxyTools::captureWorkbenchActionRedirectionAndDialog';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions/${actionId}`;
        Log.info(`${thisMethod} -- capturing workbench redirection and dialog: ${resourcePath}`);
        // GET REDIRECTION //
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, {});
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting workbench ${workbenchId} action ${actionId}: ${dialogRedirectionJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- workbench action redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        // WRITE REDIRECTION //
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const originalDialogRedirection = dialogRedirectionVisitor.copyAsJsonObject();
        dialogRedirectionVisitor.deriveDialogIdsFromDialogNameAndRecordId();
        await this.writeDialogRedirection(userId, tenantId, workbenchId, actionId, dialogRedirectionVisitor);
        // GET DIALOG //
        const originalDialogId = originalDialogRedirection['dialogId'];
        const originalDialog = await this.captureDialog(userId, baseUrl, tenantId, sessionId, originalDialogId);
        return {originalDialogRedirection, originalDialog};
    }

    public static commonFetchClient(): FetchClient {
        return this.COMMON_FETCH_CLIENT;
    }

    public static constructDialogMessageModel(message: string) {
        return {type: this.DIALOG_MESSAGE_MODEL_TYPE, message};
    }

    public static constructLoginModel(userId: string, password: string): object {
        return {
            "userId": "jordan",
            "password": "jordan1",
            "clientType": "MOBILE",
            "deviceProperties": {},
            "type": this.LOGIN_MODEL_TYPE
        };
    }

    public static constructRequestNotValidDuringOfflineMode(action: string, resourcePath: string): Promise<JsonClientResponse> {
        return Promise.resolve(new JsonClientResponse(this.constructDialogMessageModel(`${action} at ${resourcePath} is not valid during offline mode: `), 400));
    }

    public static constructNullRedirectionId(): string {
        return `null_redirection__offline_${Date.now()}`;
    }

    // ----- MODEL QUERY METHODS ----- //

    public static isActionParametersModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.ACTION_PARAMETERS_MODEL_TYPE;
    }

    public static isAnnotationModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.ANNOTATION_MODEL_TYPE;
    }

    public static isDialogModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.EDITOR_DIALOG_MODEL_TYPE ||
            jsonObject['type'] === this.QUERY_DIALOG_MODEL_TYPE;
    }

    public static isLoginModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.LOGIN_MODEL_TYPE;
    }

    public static isPropertyModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.PROPERTY_MODEL_TYPE;
    }

    public static isPropertyDefModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.PROPERTY_DEF_MODEL_TYPE;
    }

    public static isRecordModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.RECORD_MODEL_TYPE;
    }

    public static isRecordSetModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.RECORD_SET_MODEL_TYPE;
    }

    public static isReferringDialogModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.REFERRING_DIALOG_MODEL_TYPE;
    }

    public static isReferringWorkbenchModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.REFERRING_WORKBENCH_MODEL_TYPE;
    }

    public static isSessionModel(jsonObject: object): boolean {
        if (!jsonObject || !jsonObject['type']) {
            return false;
        }
        return jsonObject['type'] === this.SESSION_MODEL_TYPE;
    }

    // ----- PATH QUERY METHODS ----- //

    public static readDialogAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        return this.readDialogAsVisitor(userId, request).then(dialogVisitor => {
            return dialogVisitor ?
                new JsonClientResponse(dialogVisitor.enclosedJsonObject(), 200) :
                this.constructRequestNotValidDuringOfflineMode('readDialogAsOfflineResponse', request.resourcePath());
        });
    }

    public static readDialogAsVisitor(userId: string, request: DialogRequest): Promise<DialogRedirectionVisitor> {
        const pathFields = request.deconstructGetDialogPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        const dialogId = pathFields.dialogId;
        let key = this.DIALOG_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${dialogId}', dialogId);
        return storage.getJson(key).then(jsonObject => new DialogRedirectionVisitor(jsonObject));
    }

    public static readDialogRedirectionAsVisitor(userId: string, tenantId: string, stateId: string, actionId: string): Promise<DialogRedirectionVisitor> {
        let key = this.REDIRECTION_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${stateId}', stateId);
        key = key.replace('${actionId}', actionId);
        return storage.getJson(key).then(jsonObject => new DialogRedirectionVisitor(jsonObject));
    }

    public static readMenuActionRedirectionAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        return this.readDialogRedirectionAsVisitor(userId, pathFields.tenantId, pathFields.dialogId, pathFields.actionId).then(dialogRedirectionVisitor => {
            return dialogRedirectionVisitor ?
                new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303) :
                this.constructRequestNotValidDuringOfflineMode('readMenuActionRedirectionAsOfflineResponse', request.resourcePath());
        });
    }

    public static readRecordAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        return this.readRecordAsVisitor(userId, request).then(recordVisitor => {
            return recordVisitor ?
                new JsonClientResponse(recordVisitor.enclosedJsonObject(), 200) :
                this.constructRequestNotValidDuringOfflineMode('readRecordAsOfflineResponse', request.resourcePath());
        });
    }

    public static readRecordAsVisitor(userId: string, request: DialogRequest): Promise<RecordVisitor> {
        const pathFields = request.deconstructGetRecordPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        const dialogId = pathFields.dialogId;
        let key = this.RECORD_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${dialogId}', dialogId);
        return storage.getJson(key).then(jsonObject => new RecordVisitor(jsonObject));
    }

    public static readRecordSetAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        return this.readRecordSetAsVisitor(userId, request).then(recordSetVisitor => {
            return recordSetVisitor ?
                new JsonClientResponse(recordSetVisitor.enclosedJsonObject(), 200) :
                this.constructRequestNotValidDuringOfflineMode('readRecordSetAsOfflineResponse', request.resourcePath());
        });
    }

    public static readRecordSetAsVisitor(userId: string, request: DialogRequest): Promise<RecordSetVisitor> {
        const pathFields = request.deconstructPostRecordsPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        const dialogId = pathFields.dialogId;
        let key = this.RECORD_SET_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${dialogId}', dialogId);
        return storage.getJson(key).then(jsonObject => new RecordSetVisitor(jsonObject));
    }

    public static readWorkbenchActionRedirectionAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostWorkbenchActionPath();
        return this.readDialogRedirectionAsVisitor(userId, pathFields.tenantId, pathFields.workbenchId, pathFields.actionId).then(dialogRedirectionVisitor => {
            return dialogRedirectionVisitor ?
                new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303) :
                this.constructRequestNotValidDuringOfflineMode('readWorkbenchActionRedirectionAsOfflineResponse', request.resourcePath());
        });
    }

    public static writeDialog(userId: string, tenantId: string, dialogVisitor: DialogVisitor) {
        let key = this.DIALOG_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${dialogId}', dialogVisitor.visitId());
        return storage.setJson(key, dialogVisitor.enclosedJsonObject());
    }

    public static writeDialogRedirection(userId: string, tenantId: string, stateId: string, actionId: string,
                                         dialogRedirectionVistor: DialogRedirectionVisitor)
    {
        let key = this.REDIRECTION_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${stateId}', stateId);
        key = key.replace('${actionId}', actionId);
        return storage.setJson(key, dialogRedirectionVistor.enclosedJsonObject());
    }

    public static writeRecord(userId: string, tenantId: string, dialogId: string, recordVisitor: RecordVisitor) {
        let key = this.RECORD_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${dialogId}', dialogId);
        return storage.setJson(key, recordVisitor.enclosedJsonObject());
    }

    public static writeRecordSet(userId: string, tenantId: string, dialogId: string, recordSetVisitor: RecordSetVisitor) {
        let key = this.RECORD_SET_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${dialogId}', dialogId);
        return storage.setJson(key, recordSetVisitor.enclosedJsonObject());
    }

}
