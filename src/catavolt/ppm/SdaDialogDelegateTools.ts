import {DialogProxyTools} from "../proxy";
import {storage} from "../storage";
import {Log, StringDictionary} from "../util";
import {SdaGetBriefcaseRecordJsonTemplate} from "./SdaGetBriefcaseRecordJsonTemplate";

export class SdaDialogDelegateTools {

    // Action Ids
    private static ADD_TO_BRIEFCASE_MENU_ACTION_ID = 'alias_AddToBriefcase';
    private static WORK_PACKAGES_WORKBENCH_ACTION_ID = 'WorkPackages';

    // Dialog Names
    private static WORK_PACKAGES_ROOT_DIALOG_ALIAS = "Workpackage_General_FORM";

    // Storage Keys
    private static BRIEFCASE_RECORD_KEY = 'ppm.sda.briefcase.record';

    // Property Names
    private static ONLINE_PROPERTY_NAME = 'online';

    public static createDialogMessageModel(message: string) {
        return {type: 'hxgn.api.dialog.DialogMessage', message};
    }

    public static findBriefcaseRecord(): Promise<any> {
        return storage.getJson(SdaDialogDelegateTools.BRIEFCASE_RECORD_KEY).then(jsonObject => {
            if (!jsonObject) {
                Log.info('SdaDialogDelegateTools::findBriefcaseRecord -- briefcase record not found, using default record');
                const copy = SdaGetBriefcaseRecordJsonTemplate.response();
                Log.info('SdaDialogDelegateTools::findBriefcaseRecord -- returning copy: ' + JSON.stringify(copy));
                return copy;
            }
            return jsonObject;
        });
    }

    public static findOnlinePropertyValue(briefcaseRecord: object): boolean {
        return DialogProxyTools.findRecordPropertyValue(briefcaseRecord, SdaDialogDelegateTools.ONLINE_PROPERTY_NAME);
    }

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
        if (!dialog) {
            return false;
        }
        return (dialog.dialogAlias && dialog.dialogAlias === this.WORK_PACKAGES_ROOT_DIALOG_ALIAS);
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
        // Return original dialog with patches
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

}
