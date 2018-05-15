import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {DialogRequest} from "../proxy/DialogRequest";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {RecordVisitor} from "../proxy/RecordVisitor";
import {SessionVisitor} from "../proxy/SessionVisitor";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {StringDictionary} from "../util/StringDictionary";
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {Briefcase_Briefcase_Details_RECORD} from "./samples/Briefcase_Briefcase_Details_RECORD";
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

    public static TAGS_ROOT_DIALOG_NAME = 'Workpackage_Tags_FORM';
    public static TAGS_PROPERTIES_DIALOG_NAME = 'Workpackage_Tags_Properties';
    public static TAGS_LIST_DIALOG_NAME = 'Workpackage_Tags_Tags';

    public static WORK_PACKAGES_LIST_DIALOG_NAME = 'Workpackage_General';
    public static WORK_PACKAGES_ROOT_DIALOG_NAME = 'Workpackage_General_FORM';

    // Dynamic Dialog Ids -- PRIVATE
    private static OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX = 'offline_documents_list_';
    private static OFFLINE_DOCUMENTS_DIALOG_LIST_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX = 'offline_documents_properties_';
    private static OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX = 'offline_documents_';
    private static OFFLINE_DOCUMENTS_DIALOG_ROOT_ID = `${SdaDialogDelegateTools.OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX}\${workPackageId}`;

    private static OFFLINE_TAGS_DIALOG_LIST_ID_PREFIX = 'offline_tags_list_';
    private static OFFLINE_TAGS_DIALOG_LIST_ID = `${SdaDialogDelegateTools.OFFLINE_TAGS_DIALOG_LIST_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_TAGS_DIALOG_PROPERTIES_ID_PREFIX = 'offline_tags_properties_';
    private static OFFLINE_TAGS_DIALOG_PROPERTIES_ID = `${SdaDialogDelegateTools.OFFLINE_TAGS_DIALOG_PROPERTIES_ID_PREFIX}\${workPackageId}`;
    private static OFFLINE_TAGS_DIALOG_ROOT_ID_PREFIX = 'offline_tags_';
    private static OFFLINE_TAGS_DIALOG_ROOT_ID = `${SdaDialogDelegateTools.OFFLINE_TAGS_DIALOG_ROOT_ID_PREFIX}\${workPackageId}`;

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static BRIEFCASE_WORKBENCH_ACTION_ID = 'Briefcase';
    private static ENTER_OFFLINE_MODE_MENU_ACTION_ID = 'alias_EnterOfflineMode';
    private static EXIT_OFFLINE_MODE_MENU_ACTION_ID = 'alias_ExitOfflineMode';
    private static OPEN_MENU_ACTION_ID = 'alias_Open';
    private static OPEN_LATEST_FILE_MENU_ACTION_ID = 'alias_OpenLatestFile';
    private static REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID = 'alias_RemoveFromBriefcase';
    private static SHOW_TAGS_MENU_ACTION_ID = 'alias_ShowTags';

    // Model Types
    private static EDITOR_DIALOG_MODEL_TYPE = 'hxgn.api.dialog.EditorDialog';
    private static RECORD_SET_MODEL_TYPE = 'hxgn.api.dialog.RecordSet';
    private static SESSION_ID_MODEL_TYPE = 'hxgn.api.dialog.SessionId';

    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';

    // Storage Keys

    private static DIALOG_DELEGATE_STATE_KEY = '${userId}.${tenantId}.SdaDialogDelegate.state';

    private static OFFLINE_DOCUMENTS_REDIRECTION_KEY = '${userId}.${tenantId}.ppm.sda.workPackages.documents.redirection.${workPackageId}';

    private static OFFLINE_SESSION_KEY = '${userId}.${tenantId}.OfflineSession';

    private static OFFLINE_TAGS_REDIRECTION_KEY = '${userId}.${tenantId}.ppm.sda.workPackages.tags.redirection.${workPackageId}';

    private static OFFLINE_TAGS_DIALOG_ROOT_KEY = '${userId}.${tenantId}.ppm.sda.workPackages.tags.dialog.offline_tags_${workPackageId}';

    private static OFFLINE_TAGS_DIALOG_PROPERTIES_RECORD_KEY = '${userId}.${tenantId}.ppm.sda.workPackages.tags.dialog.offline_tags_properties_${workPackageId}.record';

    private static OFFLINE_TAGS_DIALOG_LIST_RECORD_SET_KEY = '${userId}.${tenantId}.ppm.sda.workPackages.tags.dialog.offline_tags_list_${workPackageId}.recordSet';

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
        return this.constructBriefcaseNullRedirection(tenantId, sessionId, this.ENTER_OFFLINE_MODE_MENU_ACTION_ID);
    }

    public static constructExitOfflineModeNullRedirection(tenantId: string, sessionId: string): StringDictionary {
        return this.constructBriefcaseNullRedirection(tenantId, sessionId, this.EXIT_OFFLINE_MODE_MENU_ACTION_ID);
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

    public static getOfflineTagsDialogListId(workPackageId: string) {
        return this.OFFLINE_TAGS_DIALOG_LIST_ID.replace('${workPackageId}', workPackageId);
    }

    public static getOfflineTagsDialogPropertiesId(workPackageId: string) {
        return this.OFFLINE_TAGS_DIALOG_PROPERTIES_ID.replace('${workPackageId}', workPackageId);
    }

    public static getOfflineTagsDialogRootId(workPackageId: string) {
        return this.OFFLINE_TAGS_DIALOG_ROOT_ID.replace('${workPackageId}', workPackageId);
    }

    public static isBriefcaseWorkbenchActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostWorkbenchActionPathWithActionId(SdaDialogDelegateTools.BRIEFCASE_WORKBENCH_ACTION_ID);
    }

    public static isEnterOfflineModeMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithActionId(SdaDialogDelegateTools.ENTER_OFFLINE_MODE_MENU_ACTION_ID);
    }

    public static isExitOfflineModeMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithActionId(SdaDialogDelegateTools.EXIT_OFFLINE_MODE_MENU_ACTION_ID);
    }

    public static isOfflineBriefcaseCommentsRecordSetRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostRecordsPathWithDialogId(this.OFFLINE_BRIEFCASE_DIALOG_COMMENTS_ID);
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

    public static isOfflineBriefcaseWorkPackagesRequest(dialogRequest: DialogRequest): boolean {
        if (!dialogRequest.isPostRecordsPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructPostRecordsPath();
        return SdaDialogDelegateTools.isOfflineBriefcaseWorkPackagesDialogId(pathFields.dialogId);
    }

    public static isOfflineDocumentContentRequest(dialogRequest: DialogRequest): boolean {
        // TODO: This will process ANY content request, we need a specific navigation check
        return dialogRequest.isPostSessionContentPath();
    }

    public static isOfflineDocumentOpenLatestFileMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithActionId(this.OPEN_LATEST_FILE_MENU_ACTION_ID);
    }

    public static isOfflineDocumentsListRecordSetRequest(dialogRequest: DialogRequest): boolean {
        // TODO: Change "startsWith" to do a specific comparision -- then use DialogProxyTools::isPostRecordsAtDialogId()
        if (!dialogRequest.isPostRecordsPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructPostRecordsPath();
        return pathFields.dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_LIST_ID_PREFIX);
    }

    public static isOfflineDocumentsPropertiesDialogId(dialogId: string): boolean {
        return dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_PROPERTIES_ID_PREFIX);
    }

    public static isOfflineDocumentsRootDialogRequest(dialogRequest: DialogRequest): boolean {
        // TODO: Change "startsWith" to do a specific comparision -- then use DialogProxyTools::isGetDialogAtDialogId()
        if (!dialogRequest.isGetDialogPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructGetDialogPath();
        return pathFields.dialogId.startsWith(this.OFFLINE_DOCUMENTS_DIALOG_ROOT_ID_PREFIX);
    }

    public static isOfflineShowTagsMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithActionId(this.SHOW_TAGS_MENU_ACTION_ID);
    }

    public static isOfflineTagsListRecordSetRequest(dialogRequest: DialogRequest): boolean {
        // TODO: Change "startsWith" to do a specific comparision -- then use DialogProxyTools::isPostRecordsAtDialogId()
        if (!dialogRequest.isPostRecordsPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructPostRecordsPath();
        return pathFields.dialogId.startsWith(this.OFFLINE_TAGS_DIALOG_LIST_ID_PREFIX);
    }

    public static isOfflineTagsPropertiesDialogId(dialogId: string): boolean {
        return dialogId.startsWith(this.OFFLINE_TAGS_DIALOG_PROPERTIES_ID_PREFIX);
    }

    public static isOfflineTagsRootDialogRequest(dialogRequest: DialogRequest): boolean {
        // TODO: Change "startsWith" to do a specific comparision -- then use DialogProxyTools::isGetDialogAtDialogId()
        if (!dialogRequest.isGetDialogPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructGetDialogPath();
        return pathFields.dialogId.startsWith(this.OFFLINE_TAGS_DIALOG_ROOT_ID_PREFIX);
    }

    public static isOfflineWorkPackagesListRecordSetRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostRecordsPathWithDialogId(this.OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID);
    }

    public static isOfflineWorkPackagesOpenMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithDialogIdAndActionId(this.OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID, this.OPEN_MENU_ACTION_ID);
    }

    public static isOfflineWorkPackagesRootDialogRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isGetDialogPathWithDialogId(this.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_ID);
    }

    public static isWorkPackagesAddToBriefcaseMenuActionRequest(dialogRequest: DialogRequest): boolean {
        return dialogRequest.isPostMenuActionPathWithActionId(SdaDialogDelegateTools.ADD_TO_BRIEFCASE_MENU_ACTION_ID);
    }

    public static isWorkPackagesListRecordSet(dialogRequest: DialogRequest, jsonObject: any): boolean {
        if (!dialogRequest.isPostRecordsPath()) {
            return false;
        }
        if (!jsonObject || !jsonObject.type || !jsonObject.dialogName) {
            return false;
        }
        return jsonObject.type === this.RECORD_SET_MODEL_TYPE &&
            jsonObject.dialogName === this.WORK_PACKAGES_LIST_DIALOG_NAME;
    }

    public static isWorkPackagesRemoveFromBriefcaseMenuActionRequest(dialogRequest: DialogRequest): boolean {
        if (!dialogRequest.isPostMenuActionPath()) {
            return false;
        }
        const pathFields = dialogRequest.deconstructPostMenuActionPath();
        return pathFields.actionId === SdaDialogDelegateTools.REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID;
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
                const briefcase = Briefcase_Briefcase_Details_RECORD.copyOfResponse();
                BriefcaseVisitor.visitAndSetOnline(briefcase, true);
                jsonObject = {
                    briefcase: Briefcase_Briefcase_Details_RECORD.copyOfResponse(),
                    selectedWorkPackageIds: [],
                    userId: null,
                    workPackages: RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject(),
                    mobileComments: RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject()
                };
                Log.info('SdaDialogDelegateTools::readDelegateState -- returning defaults: ' + JSON.stringify(jsonObject));
            }
            return new SdaDialogDelegateStateVisitor(jsonObject);
        });
    }

    public static readOfflineDocumentsPropertiesRecord(tenantId: string, userId: string, dialogId: string): Promise<RecordVisitor> {
        const key = `${userId}.${tenantId}.ppm.sda.workPackages.documents.dialog.${dialogId}.record`;
        return storage.getJson(key).then(jsonObject => new RecordVisitor(jsonObject));
    }

    public static readOfflineSession(tenantId: string, userId: string): Promise<SessionVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.getJson(key).then(jsonObject => new SessionVisitor(jsonObject));
    }

    public static readOfflineTagsPropertiesRecord(tenantId: string, userId: string, dialogId: string): Promise<RecordVisitor> {
        const key = `${userId}.${tenantId}.ppm.sda.workPackages.tags.dialog.${dialogId}.record`;
        return storage.getJson(key).then(jsonObject => new RecordVisitor(jsonObject));
    }

    public static async showAllStorageKeys(): Promise<void> {
        const thisMethod = 'SdaDialogDelegateTools::showAllStorageKeys';
        Log.info(`${thisMethod} -- ************** BEGIN SHOW ALL STORAGE KEYS **************`);
        const allKeys = await storage.getAllKeys();
        for (const k of allKeys) {
            const v = await storage.getItem(k);
            Log.info(`${thisMethod} -- ${k}`);
        }
        Log.info(`${thisMethod} -- ************** END SHOW ALL STORAGE KEYS **************`);
    }

    public static async showAllStorageKeysAndValues(): Promise<void> {
        const thisMethod = 'SdaDialogDelegateTools::showAllStorageKeysAndValues';
        Log.info(`${thisMethod} -- ************** BEGIN SHOW ALL STORAGE KEYS AND VALUES **************`);
        const allKeys = await storage.getAllKeys();
        for (const k of allKeys) {
            const v = await storage.getItem(k);
            Log.info(`${thisMethod} -- ${k}: ${v}`);
        }
        Log.info(`${thisMethod} -- ************** END SHOW ALL STORAGE KEYS AND VALUES **************`);
    }

    public static writeDialogDelegateState(tenantId: string, stateVisitor: SdaDialogDelegateStateVisitor): Promise<void> {
        const userId = stateVisitor.visitUserId();
        const key = this.createStorageKey(tenantId, userId, this.DIALOG_DELEGATE_STATE_KEY);
        return storage.setJson(key, stateVisitor.enclosedJsonObject());
    }

    public static writeOfflineSession(tenantId: string, userId: string, offlineSessionVisitor: SessionVisitor): Promise<void> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.setJson(key, offlineSessionVisitor.enclosedJsonObject());
    }

    private static constructBriefcaseNullRedirection(tenantId: string, sessionId: string, actionId: string): StringDictionary {
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
