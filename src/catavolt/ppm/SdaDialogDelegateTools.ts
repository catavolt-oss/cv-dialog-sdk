import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {DialogRedirectionVisitor} from "../proxy/DialogRedirectionVisitor";
import {DialogVisitor} from "../proxy/DialogVisitor";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {RecordVisitor} from "../proxy/RecordVisitor";
import {SessionVisitor} from "../proxy/SessionVisitor";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {StringDictionary} from "../util/StringDictionary";
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {SdaGetBriefcaseRecordJsonSample} from "./samples/SdaGetBriefcaseRecordJsonSample";
import {SdaDialogDelegateStateVisitor} from "./SdaDialogDelegateStateVisitor";

export class SdaDialogDelegateTools {

    // Dialog Ids
    public static OFFLINE_BRIEFCASE_DIALOG_COMMENTS_ID = 'offline_briefcase_comments';
    public static OFFLINE_BRIEFCASE_DIALOG_DETAILS_ID = 'offline_briefcase_details';
    public static OFFLINE_BRIEFCASE_DIALOG_ROOT_ID = 'offline_briefcase';
    public static OFFLINE_BRIEFCASE_DIALOG_WORK_PACKAGES_ID = 'offline_briefcase_workPackages';
    public static OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID = 'offline_workPackages_list';
    public static OFFLINE_WORK_PACKAGES_DIALOG_ROOT_ID = 'offline_workPackages';

    // Dialog Names
    public static BRIEFCASE_DETAILS_DIALOG_NAME = 'Briefcase_Briefcase_Details';
    public static BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME = 'Briefcase_Briefcase_MobileComments';
    public static BRIEFCASE_ROOT_DIALOG_NAME = 'Briefcase_Briefcase_FORM';
    public static BRIEFCASE_WORK_PACKAGES_DIALOG_NAME = 'Briefcase_Briefcase_Workpackages';
    public static DOCUMENTS_ROOT_DIALOG_NAME = 'Workpackage_Documents_FORM';
    public static DOCUMENTS_PROPERTIES_DIALOG_NAME = 'Workpackage_Documents_Properties';
    public static DOCUMENTS_LIST_DIALOG_NAME = 'Workpackage_Documents_Documents';
    public static WORK_PACKAGES_LIST_DIALOG_NAME = 'Workpackage_General';
    public static WORK_PACKAGES_ROOT_DIALOG_NAME = 'Workpackage_General_FORM';

    // Dynamic Dialog Ids -- PRIVATE
    private static OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX = 'offline_documents_list_';
    private static OFFLINE_DOCUMENTS_DIALOG_LIST_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX = 'offline_documents_properties_';
    private static OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX = 'offline_documents_';
    private static OFFLINE_DOCUMENTS_DIALOG_ROOT_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX}\${workPackageId}`;

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static BRIEFCASE_WORKBENCH_ACTION_ID = 'Briefcase';
    private static ENTER_OFFLINE_MODE_MENU_ACTION_ID = 'alias_EnterOfflineMode';
    private static EXIT_OFFLINE_MODE_MENU_ACTION_ID = 'alias_ExitOfflineMode';
    private static OPEN_MENU_ACTION_ID = 'alias_Open';
    private static REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID = 'alias_RemoveFromBriefcase';
    private static WORK_PACKAGES_WORKBENCH_ACTION_ID = 'WorkPackages';

    // Model Types
    private static EDITOR_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.EditorDialog';
    private static QUERY_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.QueryDialog';
    private static RECORD_MODEL_TYPE = 'hxgn.api.dialog.Record';
    private static RECORD_SET_MODEL_TYPE = 'hxgn.api.dialog.RecordSet';
    private static SESSION_ID_MODEL_TYPE = 'hxgn.api.dialog.SessionId';

    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';

    // Storage Keys
    private static DIALOG_DELEGATE_STATE_KEY = '${tenantId}.${userId}.ppm.sda.dialog.delegate.state';
    private static OFFLINE_DOCUMENTS_REDIRECTION_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.documents.redirection.${workPackageId}';
    private static OFFLINE_DOCUMENTS_DIALOG_ROOT_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.offline_documents_${workPackageId}';
    private static OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_RECORD_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.offline_documents_properties_${workPackageId}.record';
    private static OFFLINE_DOCUMENTS_DIALOG_LIST_RECORD_SET_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.offline_documents_list_${workPackageId}.recordSet';
    private static OFFLINE_SESSION_KEY = '${tenantId}.${userId}.offline.session';
    private static OFFLINE_WORK_PACKAGES_LIST_RECORD_SET_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.dialog.offline_workPackages_list.recordSet';
    private static OFFLINE_WORK_PACKAGES_REDIRECTION_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.redirection';
    private static OFFLINE_WORK_PACKAGES_DIALOG_ROOT_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.dialog.root';

    public static constructAddToBriefcaseNullRedirection(tenantId: string, sessionId: string, referringDialogId: string): StringDictionary {
        const nullRedirectionId = DialogProxyTools.constructNullRedirectionId();
        return {
            "tenantId": tenantId,
            "referringObject": {
                "dialogMode": "LIST",
                "dialogAlias": "Workpackage_AddToBriefcase_FORM",
                "actionId": "alias_AddToBriefcase",
                "type": "hxgn.api.dialog.ReferringDialog",
                "dialogId": referringDialogId
            },
            "refreshNeeded": true,
            "sessionId": sessionId,
            "id": nullRedirectionId,
            "type": "hxgn.api.dialog.NullRedirection"
        };
    }

    public static constructEnterOfflineModeNullRedirection(tenantId: string, sessionId: string): StringDictionary {
        return this.constructOfflineModeNullRedirection(tenantId, sessionId, this.ENTER_OFFLINE_MODE_MENU_ACTION_ID);
    }

    public static constructExitOfflineModeNullRedirection(tenantId: string, sessionId: string): StringDictionary {
        return this.constructOfflineModeNullRedirection(tenantId, sessionId, this.EXIT_OFFLINE_MODE_MENU_ACTION_ID);
    }

    public static constructOfflineLogoutResponse(sessionId: string) {
        return {
            "sessionId": sessionId,
            "type": this.SESSION_ID_MODEL_TYPE
        };
    }

    public static constructRemoveFromBriefcaseNullRedirection(tenantId: string, sessionId: string, referringDialogId: string): StringDictionary {
        const nullRedirectionId = DialogProxyTools.constructNullRedirectionId();
        return {
            "tenantId": tenantId,
            "referringObject": {
                "dialogMode": "LIST",
                "dialogAlias": "Workpackage_RemoveFromBriefcase_FORM",
                "actionId": "alias_RemoveFromBriefcase",
                "type": "hxgn.api.dialog.ReferringDialog",
                "dialogId": referringDialogId
            },
            "refreshNeeded": true,
            "sessionId": sessionId,
            "id": nullRedirectionId,
            "type": "hxgn.api.dialog.NullRedirection"
        };
    }

    public static getOfflineDocumentsDialogListId(workPackageId: string) {
        return this.OFFLINE_DOCUMENTS_DIALOG_LIST_ID.replace('${workPackageId}', workPackageId);
    }

    public static getOfflineDocumentsDialogPropertiesId(workPackageId: string) {
        return this.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID.replace('${workPackageId}', workPackageId);
    }

    public static getOfflineDocumentsDialogRootId(workPackageId: string) {
        return this.OFFLINE_DOCUMENTS_DIALOG_ROOT_ID.replace('${workPackageId}', workPackageId);
    }

    public static isBriefcaseWorkbenchActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostWorkbenchAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.BRIEFCASE_WORKBENCH_ACTION_ID;
    }

    public static isEnterOfflineModeMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.ENTER_OFFLINE_MODE_MENU_ACTION_ID;
    }

    public static isExitOfflineModeMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.EXIT_OFFLINE_MODE_MENU_ACTION_ID;
    }

    public static isOfflineBriefcaseCommentsRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        return SdaDialogDelegateTools.isOfflineBriefcaseCommentsDialogId(pathFields.dialogId);
    }

    public static isOfflineBriefcaseDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_DIALOG_ROOT_ID;
    }

    public static isOfflineBriefcaseDetailsDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_DIALOG_DETAILS_ID;
    }

    public static isOfflineBriefcaseWorkPackagesDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_DIALOG_WORK_PACKAGES_ID;
    }

    public static isOfflineBriefcaseWorkPackagesRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        return SdaDialogDelegateTools.isOfflineBriefcaseWorkPackagesDialogId(pathFields.dialogId);
    }

    public static isOfflineBriefcaseCommentsDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_DIALOG_COMMENTS_ID;
    }

    public static isOfflineDocumentsListRecordSetRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        return pathFields.dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX);
    }

    public static isOfflineDocumentsPropertiesDialogId(dialogId: string): boolean {
        return dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX);
    }

    public static isOfflineDocumentsRootDialogRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isGetDialog(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
        return pathFields.dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX);
    }

    public static isOfflineWorkPackagesListRecordSetRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        return pathFields.dialogId === this.OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID;
    }

    public static isOfflineWorkPackagesOpenMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.dialogId === this.OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID &&
            pathFields.actionId === this.OPEN_MENU_ACTION_ID;
    }

    public static isOfflineWorkPackagesRootDialogRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isGetDialog(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
        return pathFields.dialogId === this.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_ID;
    }

    public static isWorkPackagesAddToBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.ADD_TO_BRIEFCASE_MENU_ACTION_ID;
    }

    public static isWorkPackagesListRecordSet(resourcePathElems: string[], jsonObject: any): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        if (!jsonObject || !jsonObject.type || !jsonObject.dialogName) {
            return false;
        }
        return jsonObject.type === this.RECORD_SET_MODEL_TYPE &&
            jsonObject.dialogName === this.WORK_PACKAGES_LIST_DIALOG_NAME;
    }

    public static isWorkPackagesRemoveFromBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID;
    }

    public static isWorkPackagesWorkbenchActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostWorkbenchAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.WORK_PACKAGES_WORKBENCH_ACTION_ID;
    }

    public static isWorkPackagesRootDialog(jsonObject: any): boolean {
        if (!jsonObject || !jsonObject.type || !jsonObject.dialogName) {
            return false;
        }
        return jsonObject.type === this.EDITOR_DIALOG_MODEL_TYPE &&
            jsonObject.dialogName === this.WORK_PACKAGES_ROOT_DIALOG_NAME;
    }

    public static insertBriefcaseMetaDataIntoWorkPackagesDialog(originalDialog: StringDictionary): StringDictionary {
        const workPackagesQueryDialog = originalDialog.children[0];
        const propertyDefs = workPackagesQueryDialog.recordDef.propertyDefs;
        propertyDefs.push({
            "writeAllowed": false,
            "propertyName": "briefcase",
            "canCauseSideEffects": false,
            "upperCaseOnly": false,
            "propertyType": "boolean",
            "type": "hxgn.api.dialog.PropertyDef",
            "writeEnabled": false
        });
        const columns = workPackagesQueryDialog.view.columns;
        columns.push({
            "propertyName": "briefcase",
            "heading": "Briefcase",
            "type": "hxgn.api.dialog.Column"
        });
        // Return original dialog WITH patches
        return originalDialog;
    }

    public static readDialogDelegateStateVisitor(tenantId: string, userId: string): Promise<SdaDialogDelegateStateVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.DIALOG_DELEGATE_STATE_KEY);
        return storage.getJson(key).then(jsonObject => {
            if (!jsonObject) {
                const briefcase = SdaGetBriefcaseRecordJsonSample.copyOfResponse();
                BriefcaseVisitor.visitAndSetOnline(briefcase, true);
                jsonObject = {
                    briefcase: SdaGetBriefcaseRecordJsonSample.copyOfResponse(),
                    selectedWorkPackageIds: [],
                    userId: null,
                    workPackages: RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject()
                };
                Log.info('SdaDialogDelegateTools::readDelegateState -- returning defaults: ' + JSON.stringify(jsonObject));
            }
            return new SdaDialogDelegateStateVisitor(jsonObject);
        });
    }

    public static readOfflineDocumentsListRecordSet(tenantId: string, userId: string, dialogId: string): Promise<RecordSetVisitor> {
        const key = `${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.${dialogId}.recordSet`;
        return storage.getJson(key).then(jsonObject => new RecordSetVisitor(jsonObject));
    }

    public static readOfflineDocumentsPropertiesRecord(tenantId: string, userId: string, dialogId: string): Promise<RecordVisitor> {
        const key = `${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.${dialogId}.record`;
        return storage.getJson(key).then(jsonObject => new RecordVisitor(jsonObject));
    }

    public static readOfflineDocumentsRedirection(tenantId: string, userId: string, workPackageId: string): Promise<DialogRedirectionVisitor> {
        let key = this.createStorageKey(tenantId, userId, this.OFFLINE_DOCUMENTS_REDIRECTION_KEY);
        key = key.replace('${workPackageId}', workPackageId);
        return storage.getJson(key).then(jsonObject => new DialogRedirectionVisitor(jsonObject));
    }

    public static readOfflineDocumentsRootDialog(tenantId: string, userId: string, dialogId: string): Promise<DialogVisitor> {
        const key = `${tenantId}.${userId}.ppm.sda.workPackages.documents.dialog.${dialogId}`;
        return storage.getJson(key).then(jsonObject => new DialogVisitor(jsonObject));
    }

    public static readOfflineSession(tenantId: string, userId: string): Promise<SessionVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.getJson(key).then(jsonObject => new SessionVisitor(jsonObject));
    }

    public static readOfflineWorkPackagesRedirection(tenantId: string, userId: string): Promise<DialogRedirectionVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_WORK_PACKAGES_REDIRECTION_KEY);
        return storage.getJson(key).then(jsonObject => new DialogRedirectionVisitor(jsonObject));
    }

    public static readOfflineWorkPackagesRootDialog(tenantId: string, userId: string): Promise<DialogVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_KEY);
        return storage.getJson(key).then(jsonObject => new DialogVisitor(jsonObject));
    }

    public static showAllStorageKeys(): Promise<void> {
        return storage.getAllKeys().then(allKeys => {
            const keyCount = allKeys.length;
            Log.info(`SdaDialogDelegateTools::showAllStorageKeys -- key count: ${allKeys.length}`);
            for (let i = keyCount - 1; i > -1; --i) {
                Log.info(`SdaDialogDelegateTools::showAllStorageKeys -- key[${i}]: ${allKeys[i]}`);
            }
        }).catch(allKeysError => {
            Log.error("SdaDialogDelegateTools::showAllStorageKeys -- error getting all keys from storage: " + allKeysError);
        });
    }

    public static writeDialogDelegateState(tenantId: string, stateVisitor: SdaDialogDelegateStateVisitor): Promise<void> {
        const userId = stateVisitor.visitUserId();
        const key = this.createStorageKey(tenantId, userId, this.DIALOG_DELEGATE_STATE_KEY);
        return storage.setJson(key, stateVisitor.enclosedJsonObject());
    }

    public static writeOfflineDocumentsDialogListRecordSet(tenantId: string, userId: string, workPackageId: string, recordSetVisitor: RecordSetVisitor) {
        let key = this.createStorageKey(tenantId, userId, this.OFFLINE_DOCUMENTS_DIALOG_LIST_RECORD_SET_KEY);
        key = key.replace('${workPackageId}', workPackageId);
        return storage.setJson(key, recordSetVisitor.enclosedJsonObject());
    }

    public static writeOfflineDocumentsDialogPropertiesRecord(tenantId: string, userId: string, workPackageId: string, recordVisitor: RecordVisitor) {
        let key = this.createStorageKey(tenantId, userId, this.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_RECORD_KEY);
        key = key.replace('${workPackageId}', workPackageId);
        return storage.setJson(key, recordVisitor.enclosedJsonObject());
    }

    public static writeOfflineDocumentsDialogRoot(tenantId: string, userId: string, workPackageId: string, dialogVisitor: DialogVisitor) {
        let key = this.createStorageKey(tenantId, userId, this.OFFLINE_DOCUMENTS_DIALOG_ROOT_KEY);
        key = key.replace('${workPackageId}', workPackageId);
        return storage.setJson(key, dialogVisitor.enclosedJsonObject());
    }

    public static writeOfflineDocumentsRedirection(tenantId: string, userId: string, workPackageId: string, dialogRedirectionVistor: DialogRedirectionVisitor) {
        let key = this.createStorageKey(tenantId, userId, this.OFFLINE_DOCUMENTS_REDIRECTION_KEY);
        key = key.replace('${workPackageId}', workPackageId);
        return storage.setJson(key, dialogRedirectionVistor.enclosedJsonObject());
    }

    public static writeOfflineSession(tenantId: string, userId: string, offlineSessionVisitor: SessionVisitor): Promise<void> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.setJson(key, offlineSessionVisitor.enclosedJsonObject());
    }

    public static writeOfflineWorkPackagesDialogRoot(tenantId: string, userId: string, dialogVisitor: DialogVisitor) {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_KEY);
        return storage.setJson(key, dialogVisitor.enclosedJsonObject());
    }

    public static writeOfflineWorkPackagesRedirection(tenantId: string, userId: string, dialogRedirectionVistor: DialogRedirectionVisitor) {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_WORK_PACKAGES_REDIRECTION_KEY);
        return storage.setJson(key, dialogRedirectionVistor.enclosedJsonObject());
    }

    private static constructOfflineModeNullRedirection(tenantId: string, sessionId: string, actionId: string): StringDictionary {
        const nullRedirectionId = DialogProxyTools.constructNullRedirectionId();
        return {
            "tenantId": tenantId,
            "referringObject": {
                "dialogMode": "READ",
                "dialogAlias": "Briefcase_Briefcase_Details",
                "actionId": actionId,
                "type": "hxgn.api.dialog.ReferringDialog",
                "dialogId": this.OFFLINE_BRIEFCASE_DIALOG_DETAILS_ID
            },
            "refreshNeeded": true,
            "sessionId": sessionId,
            "id": nullRedirectionId,
            "type": "hxgn.api.dialog.NullRedirection"
        };
    }

    private static createStorageKey(tenantId: string, userId: string, keyTemplate: string): string {
        const key = keyTemplate.replace('${tenantId}', tenantId);
        return key.replace('${userId}', userId);
    }

}
