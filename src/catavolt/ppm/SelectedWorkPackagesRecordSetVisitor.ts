import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {SelectedWorkPackageVisitor} from "./SelectedWorkPackageVisitor";

/**
 *
 */
export class SdaSelectedWorkPackagesState extends RecordSetVisitor {

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static emptyRecordSetVisitor(): SdaSelectedWorkPackagesState {
        return new SdaSelectedWorkPackagesState(super.emptyRecordSetVisitor().enclosedJsonObject());
    }

    // --- State Management --- //

    public visitRecordAtId(id: string): SelectedWorkPackageVisitor {
        return super.visitRecordAtId(id) as SelectedWorkPackageVisitor;
    }

    public *visitRecords(): IterableIterator<SelectedWorkPackageVisitor> {
        let index = 0;
        while (index < this.enclosedJsonObject().records.length) {
            yield new SelectedWorkPackageVisitor(this.enclosedJsonObject().records[index++]);
        }
    }

}
