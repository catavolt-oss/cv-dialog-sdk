import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {DialogRedirectionVisitor} from "../proxy/DialogRedirectionVisitor";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {SessionVisitor} from "../proxy/SessionVisitor";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {StringDictionary} from "../util/StringDictionary";
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {SdaGetBriefcaseRecordJsonSample} from "./samples/SdaGetBriefcaseRecordJsonSample";
import {SdaDialogDelegateStateVisitor} from "./SdaDialogDelegateStateVisitor";

export class SdaDialogDelegateTools {

    // Dialog Ids
    public static OFFLINE_BRIEFCASE_COMMENTS_DIALOG_ID = 'offline_briefcase_comments';
    public static OFFLINE_BRIEFCASE_DETAILS_DIALOG_ID = 'offline_briefcase_details';
    public static OFFLINE_BRIEFCASE_ROOT_DIALOG_ID = 'offline_briefcase';
    public static OFFLINE_BRIEFCASE_WORK_PACKAGES_DIALOG_ID = 'offline_briefcase_workPackages';
    public static OFFLINE_WORK_PACKAGES_LIST_DIALOG_ID = 'offline_workPackages_list';
    public static OFFLINE_WORK_PACKAGES_ROOT_DIALOG_ID = 'offline_workPackages';

    // Dialog Names
    public static BRIEFCASE_DETAILS_DIALOG_NAME = 'Briefcase_Briefcase_Details';
    public static BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME = 'Briefcase_Briefcase_MobileComments';
    public static BRIEFCASE_ROOT_DIALOG_NAME = 'Briefcase_Briefcase_FORM';
    public static BRIEFCASE_WORK_PACKAGES_DIALOG_NAME = 'Briefcase_Briefcase_Workpackages';
    public static WORK_PACKAGES_LIST_DIALOG_NAME = 'Workpackage_General';
    public static WORK_PACKAGES_ROOT_DIALOG_NAME = 'Workpackage_General_FORM';

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static BRIEFCASE_WORKBENCH_ACTION_ID = 'Briefcase';
    private static ENTER_OFFLINE_MODE_MENU_ACTION_ID = 'alias_EnterOfflineMode';
    private static EXIT_OFFLINE_MODE_MENU_ACTION_ID = 'alias_ExitOfflineMode';
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
    private static OFFLINE_SESSION_KEY = '${tenantId}.${userId}.offline.session';
    private static OFFLINE_WORK_PACKAGES_REDIRECTION_KEY = '${tenantId}.${userId}.ppm.sda.workPackages.redirection';

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

    public static isBriefcaseWorkbenchActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostWorkbenchAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.BRIEFCASE_WORKBENCH_ACTION_ID;
    }

    public static isAddToBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.ADD_TO_BRIEFCASE_MENU_ACTION_ID;
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
        return dialogId === this.OFFLINE_BRIEFCASE_ROOT_DIALOG_ID;
    }

    public static isOfflineBriefcaseDetailsDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_DETAILS_DIALOG_ID;
    }

    public static isOfflineBriefcaseWorkPackagesDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_WORK_PACKAGES_DIALOG_ID;
    }

    public static isOfflineBriefcaseWorkPackagesRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        return SdaDialogDelegateTools.isOfflineBriefcaseWorkPackagesDialogId(pathFields.dialogId);
    }

    public static isOfflineBriefcaseCommentsDialogId(dialogId: string): boolean {
        return dialogId === this.OFFLINE_BRIEFCASE_COMMENTS_DIALOG_ID;
    }

    public static isRemoveFromBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID;
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

    public static readOfflineSession(tenantId: string, userId: string): Promise<SessionVisitor> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.getJson(key).then(jsonObject => new SessionVisitor(jsonObject));
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

    public static writeOfflineSession(tenantId: string, userId: string, offlineSessionVisitor: SessionVisitor): Promise<void> {
        const key = this.createStorageKey(tenantId, userId, this.OFFLINE_SESSION_KEY);
        return storage.setJson(key, offlineSessionVisitor.enclosedJsonObject());
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
                "dialogId": this.OFFLINE_BRIEFCASE_DETAILS_DIALOG_ID
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
