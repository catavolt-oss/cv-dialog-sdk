import {DialogProxyTools} from "../proxy/DialogProxyTools";
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
    private static WORK_PACKAGES_ROOT_DIALOG_ALIAS = "Workpackage_General_FORM";
    // Model Types
    private static EDITOR_DIALOG_MODEL_TYPE = "hxgn.api.dialog.EditorDialog";
    private static QUERY_DIALOG_MODEL_TYPE = "hxgn.api.dialog.QueryDialog";
    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';
    // Storage Keys
    private static BRIEFCASE_RECORD_KEY = 'ppm.sda.briefcase.record';
    private static DIALOG_DELEGATE_STATE_KEY = 'ppm.sda.dialog.delegate.state';

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

    public static isWorkPackagesRootDialog(dialog: any): boolean {
        if (!dialog || !dialog.type || !dialog.dialogAlias) {
            return false;
        }
        return dialog.type === this.EDITOR_DIALOG_MODEL_TYPE &&
            dialog.dialogAlias === this.WORK_PACKAGES_ROOT_DIALOG_ALIAS;
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

    public static patchWorkPackagesRecordSet(originalRecordSet: any, delegateRecordSet: any): any {
        const delegateRecords = delegateRecordSet ? delegateRecordSet.records : [];
        const originalRecords = originalRecordSet.records;
        if (originalRecords) {
            for (const r of originalRecords) {
                let delegateBriefcase = false;
                for (const delegateRecord of delegateRecords) {
                    if (r.id === delegateRecord.id) {
                        delegateBriefcase = true;
                        break;
                    }
                }
                const briefcaseField = {
                    "name": "briefcase",
                    "annotations": [],
                    "type": "hxgn.api.dialog.Property",
                    "value": delegateBriefcase
                };
                r.properties.push(briefcaseField);
            }
        }
        // Return original record set with patches
        return originalRecordSet;
    }

    public static readDelegateState(): Promise<SdaDialogDelegateState> {
        return storage.getJson(SdaDialogDelegateTools.DIALOG_DELEGATE_STATE_KEY).then(jsonObject => {
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

    public static writeDelegateState(delegateState: SdaDialogDelegateState): Promise<void> {
        Log.info('SdaDialogDelegateTools::writeDelegateState -- delegate state: ' + delegateState.copyAsJsonString());
        return storage.setJson(SdaDialogDelegateTools.DIALOG_DELEGATE_STATE_KEY, delegateState.internalValue());
    }

}
