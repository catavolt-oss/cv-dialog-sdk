import { RecordSetVisitor } from '../proxy/RecordSetVisitor';
import { WorkPackageVisitor } from './WorkPackageVisitor';

/**
 *
 */
export class WorkPackagesRecordSetVisitor extends RecordSetVisitor {
    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static emptyRecordSetVisitor(): WorkPackagesRecordSetVisitor {
        return new WorkPackagesRecordSetVisitor(super.emptyRecordSetVisitor().enclosedJsonObject());
    }

    // --- State Management --- //

    public updateBriefcaseColumnUsingSelections(selectedWorkPackageIds: string[]) {
        const workPackages = this.enclosedJsonObject().records;
        if (workPackages) {
            for (const r of workPackages) {
                let inBriefcase = false;
                for (const selectedId of selectedWorkPackageIds) {
                    if (r.id === selectedId) {
                        inBriefcase = true;
                        break;
                    }
                }
                const briefcaseProperty = {
                    name: 'briefcase',
                    annotations: [],
                    type: 'hxgn.api.dialog.Property',
                    value: inBriefcase
                };
                r.properties.push(briefcaseProperty);
            }
        }
    }

    public visitRecordAtId(id: string): WorkPackageVisitor {
        return super.visitRecordAtId(id) as WorkPackageVisitor;
    }

    public *visitRecords(): IterableIterator<WorkPackageVisitor> {
        let index = 0;
        while (index < this.enclosedJsonObject().records.length) {
            yield new WorkPackageVisitor(this.enclosedJsonObject().records[index++]);
        }
    }
}
