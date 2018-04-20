import {RecordSetState} from "../proxy/RecordSetState";
import {SdaWorkPackageState} from "./SdaWorkPackageState";
import {SdaSelectedWorkPackageState} from "./SdaSelectedWorkPackageState";

/**
 *
 */
export class SdaWorkPackagesState extends RecordSetState {

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static emptyRecordSet(): SdaWorkPackagesState {
        return new SdaWorkPackagesState(super.emptyRecordSet().internalValue());
    }

    // --- State Management --- //

    public findRecordAtId(id: string): SdaWorkPackageState {
        return super.findRecordAtId(id) as SdaWorkPackageState;
    }

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

    public * records(): IterableIterator<SdaWorkPackageState> {
        let index = 0;
        while (index < this.internalValue().records.length) {
            yield new SdaWorkPackageState(this.internalValue().records[index++]);
        }
    }

}
