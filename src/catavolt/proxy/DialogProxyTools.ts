import {JsonClientResponse} from "../client/JsonClientResponse";
import {storage} from "../storage";
import {Base64} from "../util/Base64";
import {Log} from "../util/Log";
import {FetchClient} from "../ws/FetchClient";
import {ContentRedirectionVisitor} from "./ContentRedirectionVisitor";
import {DialogRedirectionVisitor} from "./DialogRedirectionVisitor";
import {DialogRequest} from "./DialogRequest";
import {DialogVisitor} from "./DialogVisitor";
import {LargePropertyVisitor} from "./LargePropertyVisitor";
import {ReadLargePropertyParametersVisitor} from "./ReadLargePropertyParametersVisitor";
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
    private static CONTENT_STORAGE_KEY =     '${userId}.${tenantId}.${contentId}.${sequence}';
    private static DIALOG_STORAGE_KEY =      '${userId}.${tenantId}.${dialogId}.dialog';
    private static RECORD_SET_STORAGE_KEY =  '${userId}.${tenantId}.${dialogId}.recordset';
    private static RECORD_STORAGE_KEY =      '${userId}.${tenantId}.${dialogId}.record';
    private static REDIRECTION_STORAGE_KEY = '${userId}.${tenantId}.${stateId}.${actionId}.redirection';

    private static COMMON_FETCH_CLIENT = new FetchClient();

    public static async captureDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, dialogId: string): Promise<object> {
        const thisMethod = 'DialogProxyTools::captureDialog';
        // GET DIALOG //
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`;
        Log.info(`${thisMethod} -- capturing online dialog: ${resourcePath}`);
        const dialogJcr = await DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath);
        if (dialogJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting dialog ${dialogId}: ${dialogJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- dialog: ${JSON.stringify(dialogJcr.value)}`);
        // WRITE DIALOG //
        const dialogVisitor = new DialogVisitor(dialogJcr.value);
        const beforeDialog = dialogVisitor.copyAsJsonObject();
        dialogVisitor.deriveDialogIdsFromDialogNameAndRecordId();
        Log.info(`${thisMethod} -- writing online dialog to offline dialog id: ${dialogVisitor.visitId()}`);
        Log.info(`${thisMethod} -- writing online dialog to offline storage: ${dialogVisitor.copyAsJsonString()}`);
        await this.writeDialog(userId, tenantId, dialogVisitor);
        return {beforeDialog, afterDialog: dialogVisitor.enclosedJsonObject()};
    }

    public static async captureMenuActionRedirectionAndDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, dialogId: string, actionId: string, targetId: string, impliedTargetId): Promise<any> {
        const thisMethod = 'DialogProxyTools::captureMenuActionRedirectionAndDialog';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions/${actionId}`;
        Log.info(`${thisMethod} -- capturing menu redirection and dialog: ${resourcePath}`);
        // GET REDIRECTION //
        const actionParameters = {
            targets: [targetId],
            type: "hxgn.api.dialog.ActionParameters"
        };
        Log.info(`${thisMethod} -- capturing online dialog redirection: ${resourcePath}`);
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, actionParameters);
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting menu dialog ${dialogId} action ${actionId}: ${dialogRedirectionJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- menu action redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        // WRITE REDIRECTION //
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const beforeDialogRedirection = dialogRedirectionVisitor.copyAsJsonObject();
        dialogRedirectionVisitor.deriveDialogIdsFromDialogNameAndRecordId();
        let actionIdAtTargetId = actionId;
        if (targetId) {
            const targetIdEncoded = Base64.encodeUrlSafeString(targetId);
            actionIdAtTargetId = actionIdAtTargetId + '@' + targetIdEncoded;
        }
        Log.info(`${thisMethod} -- writing online dialog redirection with dialog id: ${dialogRedirectionVisitor.visitDialogId()}`);
        Log.info(`${thisMethod} -- writing online dialog redirection with referring dialog id: ${dialogRedirectionVisitor.visitReferringDialogId()}`);
        Log.info(`${thisMethod} -- writing online dialog redirection with record id: ${dialogRedirectionVisitor.visitRecordId()}`);
        Log.info(`${thisMethod} -- writing online dialog redirection to offline redirection id: ${dialogRedirectionVisitor.visitId()}`);
        Log.info(`${thisMethod} -- writing online dialog redirection to offline storage: ${dialogRedirectionVisitor.copyAsJsonString()}`);

        let dialogIdAtTargetId = dialogRedirectionVisitor.visitReferringDialogId();
        if (impliedTargetId) {
            const impliedTargetIdEncoded = Base64.encodeUrlSafeString(impliedTargetId);
            dialogIdAtTargetId = dialogIdAtTargetId + '@' + impliedTargetIdEncoded;
        }
        await this.writeDialogRedirection(userId, tenantId, dialogIdAtTargetId, actionIdAtTargetId, dialogRedirectionVisitor);
        // CAPTURE DIALOG //
        const beforeDialogId = beforeDialogRedirection['dialogId'];
        const beforeAndAfterDialog = await this.captureDialog(userId, baseUrl, tenantId, sessionId, beforeDialogId);
        return {beforeDialogRedirection, afterDialogRedirection: dialogRedirectionVisitor.enclosedJsonObject(),
            beforeDialog: beforeAndAfterDialog['beforeDialog'], afterDialog: beforeAndAfterDialog['afterDialog']};
    }

    public static async captureRecord(userId: string, baseUrl: string, tenantId: string, sessionId: string, beforeAndAfterValues: any, listDialogName: string): Promise<RecordVisitor> {
        const thisMethod = 'DialogProxyTools::captureRecord';
        // ONLINE
        const onlineRootDialogVisitor = new DialogVisitor(beforeAndAfterValues.beforeDialog);
        const onlineEditorDialogVisitor = onlineRootDialogVisitor.visitChildAtName(listDialogName);
        const onlineEditorDialogId = onlineEditorDialogVisitor.visitId();
        const onlineEditorRecordPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineEditorDialogId}/record`;
        Log.info(`${thisMethod} -- capturing online record: ${onlineEditorRecordPath}`);
        const onlineEditorRecordJcr = await DialogProxyTools.commonFetchClient().getJson(baseUrl, onlineEditorRecordPath);
        if (onlineEditorRecordJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting record: ${onlineEditorRecordJcr.statusCode}`);
        }
        const onlineEditorRecordVisitor = new RecordVisitor(onlineEditorRecordJcr.value);
        // OFFLINE
        const offlineRootDialogVisitor = new DialogVisitor(beforeAndAfterValues.afterDialog);
        const offlineEditorDialogVisitor = offlineRootDialogVisitor.visitChildAtName(listDialogName);
        const offlineEditorDialogId = offlineEditorDialogVisitor.visitId();
        // WRITE TO STORAGE
        Log.info(`${thisMethod} -- writing online record to offline editor dialog id: ${offlineEditorDialogId}`);
        Log.info(`${thisMethod} -- writing online record to offline storage: ${onlineEditorRecordVisitor.copyAsJsonString()}`);
        await DialogProxyTools.writeRecord(userId, tenantId, offlineEditorDialogId, onlineEditorRecordVisitor);
        return onlineEditorRecordVisitor;
    }

    public static async captureRecordSet(userId: string, baseUrl: string, tenantId: string, sessionId: string, beforeAndAfterValues: any, listDialogName: string): Promise<RecordSetVisitor> {
        const thisMethod = 'DialogProxyTools::captureRecordSet';
        // ONLINE
        const onlineRootDialogVisitor = new DialogVisitor(beforeAndAfterValues.beforeDialog);
        const onlineQueryDialogVisitor = onlineRootDialogVisitor.visitChildAtName(listDialogName);
        const onlineQueryDialogId = onlineQueryDialogVisitor.visitId();
        const onlineQueryRecordsPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineQueryDialogId}/records`;
        const onlineQueryParameters = {
            fetchDirection: "FORWARD",
            fetchMaxRecords: 999,
            type: "hxgn.api.dialog.QueryParameters"
        };
        Log.info(`${thisMethod} -- capturing online record set: ${onlineQueryRecordsPath}`);
        const onlineQueryRecordsJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, onlineQueryRecordsPath, onlineQueryParameters);
        if (onlineQueryRecordsJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting records: ${onlineQueryRecordsJcr.statusCode}`);
        }
        const onlineQueryRecordSetVisitor = new RecordSetVisitor(onlineQueryRecordsJcr.value);
        // OFFLINE
        const offlineRootDialogVisitor = new DialogVisitor(beforeAndAfterValues.afterDialog);
        const offlineQueryDialogVisitor = offlineRootDialogVisitor.visitChildAtName(listDialogName);
        const offlineQueryDialogId = offlineQueryDialogVisitor.visitId();
        // WRITE TO STORAGE
        Log.info(`${thisMethod} -- writing online record set to offline query dialog id: ${offlineQueryDialogId}`);
        Log.info(`${thisMethod} -- writing online record set to offline storage: ${onlineQueryRecordSetVisitor.copyAsJsonString()}`);
        await DialogProxyTools.writeRecordSet(userId, tenantId, offlineQueryDialogId, onlineQueryRecordSetVisitor);
        return onlineQueryRecordSetVisitor;
    }

    public static async captureWorkbenchActionRedirectionAndDialog(userId: string, baseUrl: string, tenantId: string, sessionId: string, workbenchId: string, actionId: string): Promise<any> {
        const thisMethod = 'DialogProxyTools::captureWorkbenchActionRedirectionAndDialog';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions/${actionId}`;
        Log.info(`${thisMethod} -- capturing workbench redirection and dialog: ${resourcePath}`);
        // GET REDIRECTION //
        Log.info(`${thisMethod} -- capturing online dialog redirection: ${resourcePath}`);
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, {});
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting workbench ${workbenchId} action ${actionId}: ${dialogRedirectionJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- workbench action redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        // WRITE REDIRECTION //
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const beforeDialogRedirection = dialogRedirectionVisitor.copyAsJsonObject();
        dialogRedirectionVisitor.deriveDialogIdsFromDialogNameAndRecordId();
        Log.info(`${thisMethod} -- writing online dialog redirection to offline redirection id: ${dialogRedirectionVisitor.visitId()}`);
        Log.info(`${thisMethod} -- writing online dialog redirection to offline storage: ${dialogRedirectionVisitor.copyAsJsonString()}`);
        await this.writeDialogRedirection(userId, tenantId, workbenchId, actionId, dialogRedirectionVisitor);
        // CAPTURE DIALOG //
        const beforeDialogId = beforeDialogRedirection['dialogId'];
        const beforeAndAfterDialog = await this.captureDialog(userId, baseUrl, tenantId, sessionId, beforeDialogId);
        return {beforeDialogRedirection, afterDialogRedirection: dialogRedirectionVisitor.enclosedJsonObject(),
            beforeDialog: beforeAndAfterDialog['beforeDialog'], afterDialog: beforeAndAfterDialog['afterDialog']};
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

    public static constructRequestNotValidDuringOfflineMode(action: string, resourcePath: string): JsonClientResponse {
        return new JsonClientResponse(this.constructDialogMessageModel(`${action} at ${resourcePath} is not valid during offline mode: `), 400);
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

    public static readDialogAsVisitor(userId: string, request: DialogRequest): Promise<DialogVisitor> {
        const thisMethod = 'DialogProxyTools::readDialogAsVisitor';
        const pathFields = request.deconstructGetDialogPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        const dialogId = pathFields.dialogId;
        let key = this.DIALOG_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${dialogId}', dialogId);
        Log.info(`${thisMethod} -- reading for dialog at key: ${key}`);
        return storage.getJson(key).then(jsonObject => jsonObject ? new DialogVisitor(jsonObject) : null);
    }

    public static readDialogRedirectionAsVisitor(userId: string, tenantId: string, stateId: string, actionId: string): Promise<DialogRedirectionVisitor> {
        const thisMethod = 'DialogProxyTools::readDialogRedirectionAsVisitor';
        let key = this.REDIRECTION_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${stateId}', stateId);
        key = key.replace('${actionId}', actionId);
        Log.info(`${thisMethod} -- reading for redirection at key: ${key}`);
        return storage.getJson(key).then(jsonObject => jsonObject ? new DialogRedirectionVisitor(jsonObject) : null);
    }

    public static readMenuActionRedirectionAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        let actionIdAtTargetId = request.actionId();
        const targetId = request.targetId();
        if (targetId) {
            const targetIdEncoded = Base64.encodeUrlSafeString(targetId);
            actionIdAtTargetId = `${request.actionId()}@${targetIdEncoded}`;
        }
        return this.readDialogRedirectionAsVisitor(userId, pathFields.tenantId, pathFields.dialogId, actionIdAtTargetId).then(dialogRedirectionVisitor => {
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
        let key = this.RECORD_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${dialogId}', dialogId);
        return storage.getJson(key).then(jsonObject => jsonObject ? new RecordVisitor(jsonObject) : null);
    }

    public static readRecordSetAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        return this.readRecordSetAsVisitor(userId, request).then(recordSetVisitor => {
            return recordSetVisitor ?
                new JsonClientResponse(recordSetVisitor.enclosedJsonObject(), 200) :
                this.constructRequestNotValidDuringOfflineMode('readRecordSetAsOfflineResponse', request.resourcePath());
        });
    }

    public static async readRecordSetAsVisitor(userId: string, request: DialogRequest): Promise<RecordSetVisitor> {
        const pathFields = request.deconstructPostRecordsPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        const dialogId = pathFields.dialogId;
        let key = this.RECORD_SET_STORAGE_KEY.replace('${tenantId}', tenantId);
        key = key.replace('${userId}', userId);
        key = key.replace('${dialogId}', dialogId);
        const jsonObject = await storage.getJson(key);
        if (!jsonObject) {
            return null;
        }
        const recordSetVisitor = new RecordSetVisitor(jsonObject);
        if (request.body().fromRecordId) {
            recordSetVisitor.fromRecordId(request.body().fromRecordId);
        }
        return recordSetVisitor;
    }

    public static readSessionContentAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostSessionContentPath();
        const tenantId = pathFields.tenantId;
        const contentId = pathFields.contentId;
        const parametersVisitor = new ReadLargePropertyParametersVisitor(request.body());
        const sequence = parametersVisitor.visitSequence();
        return this.readSessionContentAsVisitor(userId, tenantId, contentId, sequence).then(largePropertyVisitor => {
            return largePropertyVisitor ?
                new JsonClientResponse(largePropertyVisitor.enclosedJsonObject(), 200) :
                this.constructRequestNotValidDuringOfflineMode('readSessionContentAsOfflineResponse', request.resourcePath());
        });
    }

    public static readSessionContentAsVisitor(userId: string, tenantId: string, contentId: string, sequence: number): Promise<LargePropertyVisitor> {
        let key = this.CONTENT_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${contentId}', contentId);
        key = key.replace('${sequence}', sequence.toString());
        return storage.getJson(key).then(jsonObject => jsonObject ? new LargePropertyVisitor(jsonObject) : null);
    }

    public static readWorkbenchActionRedirectionAsOfflineResponse(userId: string, request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostWorkbenchActionPath();
        return this.readDialogRedirectionAsVisitor(userId, pathFields.tenantId, pathFields.workbenchId, pathFields.actionId).then(dialogRedirectionVisitor => {
            return dialogRedirectionVisitor ?
                new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303) :
                this.constructRequestNotValidDuringOfflineMode('readWorkbenchActionRedirectionAsOfflineResponse', request.resourcePath());
        });
    }

    public static writeContentChunk(userId: string, tenantId: string, contentId: string, sequence: number, largePropertyVisitor: LargePropertyVisitor): Promise<void> {
        let key = this.CONTENT_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${contentId}', contentId);
        key = key.replace('${sequence}', sequence.toString());
        return storage.setJson(key, largePropertyVisitor.enclosedJsonObject());
    }

    public static writeContentRedirection(userId: string, tenantId: string, stateId: string, actionId: string,
                                          contentRedirectionVistor: ContentRedirectionVisitor)
    {
        let key = this.REDIRECTION_STORAGE_KEY.replace('${userId}', userId);
        key = key.replace('${tenantId}', tenantId);
        key = key.replace('${stateId}', stateId);
        key = key.replace('${actionId}', actionId);
        return storage.setJson(key, contentRedirectionVistor.enclosedJsonObject());
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
