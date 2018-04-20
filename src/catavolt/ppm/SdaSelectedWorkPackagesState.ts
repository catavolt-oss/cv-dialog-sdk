import {RecordSetState} from "../proxy/RecordSetState";
import {SdaSelectedWorkPackageState} from "./SdaSelectedWorkPackageState";
import {RecordState} from "../proxy/RecordState";

/**
 *
 */
export class SdaSelectedWorkPackagesState extends RecordSetState {

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static emptyRecordSet(): SdaSelectedWorkPackagesState {
        return new SdaSelectedWorkPackagesState(super.emptyRecordSet().internalValue());
    }

    // --- State Management --- //

    public findRecordAtId(id: string): SdaSelectedWorkPackageState {
        return super.findRecordAtId(id) as SdaSelectedWorkPackageState;
    }

    public *records(): IterableIterator<SdaSelectedWorkPackageState> {
        let index = 0;
        while (index < this.internalValue().records.length) {
            yield new SdaSelectedWorkPackageState(this.internalValue().records[index++]);
        }
    }

}
