import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {SessionState} from "../proxy/SessionState";
import {storage} from "../storage";
import {Log} from "../util/Log";
import {StringDictionary} from "../util/StringDictionary";
import {SdaGetBriefcaseRecordJsonSample} from "./samples/SdaGetBriefcaseRecordJsonSample";
import {SdaDialogDelegateState} from "./SdaDialogDelegateState";

export class SdaDialogDelegateTools {

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static WORK_PACKAGES_WORKBENCH_ACTION_ID = 'WorkPackages';

    // Dialog Names
    private static WORK_PACKAGES_QUERY_DIALOG_ALIAS = "Workpackage_General";
    private static WORK_PACKAGES_ROOT_DIALOG_ALIAS = "Workpackage_General_FORM";

    // Model Types
    private static EDITOR_DIALOG_MODEL_TYPE = "hxgn.api.dialog.EditorDialog";
    private static QUERY_DIALOG_MODEL_TYPE = "hxgn.api.dialog.QueryDialog";
    private static RECORD_SET_MODEL_TYPE = "hxgn.api.dialog.RecordSet";

    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';

    // Storage Keys
    private static DIALOG_DELEGATE_STATE_KEY = 'ppm.sda.${tenantId}.${userId}.dialog.delegate.state';
    private static SELECTED_WORK_PACKAGES_STATE_KEY = 'ppm.sda.${tenantId}.${userId}.selected.workPackages';

    public static isAddToBriefcaseMenuActionRequest(resourcePathElems: string[]): boolean {
        if (!DialogProxyTools.isPostMenuAction(resourcePathElems)) {
            return false;
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return pathFields.actionId === SdaDialogDelegateTools.ADD_TO_BRIEFCASE_MENU_ACTION_ID;
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

    public static patchWorkPackagesRecordSet(freshWorkPackagesRecordSet: any, selectedWorkPackagesRecordSet: any): any {
        const selectedWorkPackageRecs = selectedWorkPackagesRecordSet ? selectedWorkPackagesRecordSet.records : [];
        const freshWorkPackageRecs = freshWorkPackagesRecordSet.records;
        if (freshWorkPackageRecs) {
            for (const r of freshWorkPackageRecs) {
                let inBriefcase = false;
                for (const selectedRecord of selectedWorkPackageRecs) {
                    if (r.id === selectedRecord.id) {
                        inBriefcase = true;
                        break;
                    }
                }
                const briefcaseField = {
                    "name": "briefcase",
                    "annotations": [],
                    "type": "hxgn.api.dialog.Property",
                    "value": inBriefcase
                };
                r.properties.push(briefcaseField);
            }
        }
        // Return fresh record set WITH PATCHES (no longer fresh)
        return freshWorkPackagesRecordSet;
    }

    private static createDelegateStateKey(tenantId: string, userId: string): string {
        const key = SdaDialogDelegateTools.DIALOG_DELEGATE_STATE_KEY.replace('${tenantId}', tenantId);
        return key.replace('${userId}', userId);
    }

    public static readDelegateState(tenantId: string, userId: string): Promise<SdaDialogDelegateState> {
        const key = this.createDelegateStateKey(tenantId, userId);
        return storage.getJson(key).then(jsonObject => {
            if (!jsonObject) {
                jsonObject = {briefcaseRecord: SdaGetBriefcaseRecordJsonSample.response(), userId: null};
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

    public static writeDelegateState(tenantId: string, userId: string, delegateState: SdaDialogDelegateState): Promise<void> {
        Log.info('SdaDialogDelegateTools::writeDelegateState -- delegate state: ' + delegateState.copyAsJsonString());
        const key = this.createDelegateStateKey(tenantId, userId);
        return storage.setJson(key, delegateState.internalValue());
    }

}
