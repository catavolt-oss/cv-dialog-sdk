import {RecordSetState} from "../proxy/RecordSetState";
import {SdaSelectedWorkPackagesState} from "./SdaSelectedWorkPackagesState";

/**
 *
 */
export class SdaWorkPackagesState extends RecordSetState {

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    // --- State Management --- //

    public insertBriefcaseFieldsUsingSelections(selectedWorkPackageIds: string[]) {
        const workPackages = this.internalValue().records;
        if (workPackages) {
            for (const r of workPackages) {
                let inBriefcase = false;
                for (const selectedId of selectedWorkPackageIds) {
                    if (r.id === selectedId) {
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
    }

}
