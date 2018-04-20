import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {StringDictionary} from "../util/StringDictionary";
import {SdaGetBriefcaseRecordJsonSample} from "./samples/SdaGetBriefcaseRecordJsonSample";
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {SdaDialogDelegateState} from "./SdaDialogDelegateState";

export class SdaDialogDelegateTools {

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static BRIEFCASE_WORKBENCH_ACTION_ID = 'Briefcase';
    private static REMOVE_FROM_BRIEFCASE_MENU_ACTION_ID = 'alias_RemoveFromBriefcase';
    private static WORK_PACKAGES_WORKBENCH_ACTION_ID = 'WorkPackages';

    // Dialog Names
    private static WORK_PACKAGES_QUERY_DIALOG_ALIAS = "Workpackage_General";
    private static WORK_PACKAGES_ROOT_DIALOG_ALIAS = "Workpackage_General_FORM";

    // Model Types
    private static EDITOR_DIALOG_MODEL_TYPE = "hxgn.api.dialog.EditorDialog";
    private static QUERY_DIALOG_MODEL_TYPE = "hxgn.api.dialog.QueryDialog";
    private static RECORD_MODEL_TYPE = "hxgn.api.dialog.Record";
    private static RECORD_SET_MODEL_TYPE = "hxgn.api.dialog.RecordSet";

    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';

    // Storage Keys
    private static DIALOG_DELEGATE_STATE_KEY = 'ppm.sda.${tenantId}.${userId}.dialog.delegate.state';

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

    public static isRemoveFromBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
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

    public static isWorkPackagesQueryRecordSet(resourcePathElems: string[], jsonObject: any): boolean {
        if (!DialogProxyTools.isPostRecords(resourcePathElems)) {
            return false;
        }
        if (!jsonObject || !jsonObject.type || !jsonObject.dialogAlias) {
            return false;
        }
        return jsonObject.type === this.RECORD_SET_MODEL_TYPE &&
            jsonObject.dialogAlias === this.WORK_PACKAGES_QUERY_DIALOG_ALIAS;
    }

    public static isWorkPackagesRootDialog(jsonObject: any): boolean {
        if (!jsonObject || !jsonObject.type || !jsonObject.dialogAlias) {
            return false;
        }
        return jsonObject.type === this.EDITOR_DIALOG_MODEL_TYPE &&
            jsonObject.dialogAlias === this.WORK_PACKAGES_ROOT_DIALOG_ALIAS;
    }

    public static patchWorkPackagesDialog(originalDialog: StringDictionary): StringDictionary {
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

    private static createDelegateStateKey(tenantId: string, userId: string): string {
        const key = SdaDialogDelegateTools.DIALOG_DELEGATE_STATE_KEY.replace('${tenantId}', tenantId);
        return key.replace('${userId}', userId);
    }

    public static readDelegateState(tenantId: string, userId: string): Promise<SdaDialogDelegateState> {
        const key = this.createDelegateStateKey(tenantId, userId);
        return storage.getJson(key).then(jsonObject => {
            if (!jsonObject) {
                const briefcase = SdaGetBriefcaseRecordJsonSample.response();
                BriefcaseVisitor.visitAndSetOnlineValue(briefcase, true);
                jsonObject = {
                    briefcase: SdaGetBriefcaseRecordJsonSample.response(),
                    selectedWorkPackageIds: [],
                    userId: null,
                    workPackages: RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject()
                };
                Log.info('SdaDialogDelegateTools::readDelegateState -- returning defaults: ' + JSON.stringify(jsonObject));
            }
            return new SdaDialogDelegateState(jsonObject);
        });
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

    public static writeDelegateState(tenantId: string, delegateState: SdaDialogDelegateState): Promise<void> {
        const userId = delegateState.userId();
        const key = this.createDelegateStateKey(tenantId, userId);
        return storage.setJson(key, delegateState.internalValue());
    }

}
