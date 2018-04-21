import {JsonObjectVisitor} from "../proxy";
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {WorkPackagesRecordSetVisitor} from "./WorkPackagesRecordSetVisitor";

/**
 *
 */
export class SdaDialogDelegateStateVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(state: string | object) {
        if (typeof state === 'string') {
            this._enclosedJsonObject = JSON.parse(state as string);
        } else {
            this._enclosedJsonObject = state;
        }
    }

    // --- State Management Helpers --- //

    // --- State Import/Export --- //

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    // --- State Management --- //

    public selectedWorkPackageIds(): string[] {
        return this.enclosedJsonObject().selectedWorkPackageIds;
    }

    public addSelectedWorkPackageId(id: string) {
        const index = this.enclosedJsonObject().selectedWorkPackageIds.indexOf(id);
        if (index === -1) {
            this.enclosedJsonObject().selectedWorkPackageIds.push(id);
        }
    }

    public removeSelectedWorkPackageId(id: string) {
        const index = this.enclosedJsonObject().selectedWorkPackageIds.indexOf(id);
        if (index > -1) {
            this.enclosedJsonObject().selectedWorkPackageIds.splice(index, 1);
        }
    }

    public visitBriefcase(): BriefcaseVisitor {
        return new BriefcaseVisitor(this.enclosedJsonObject().briefcase);
    }

    public visitUserId(): string {
        return this.enclosedJsonObject().userId;
    }

    public visitAndSetUserId(userId: string) {
        this.enclosedJsonObject().userId = userId;
    }

    public visitWorkPackagesRecordSet(): WorkPackagesRecordSetVisitor {
        return new WorkPackagesRecordSetVisitor(this.enclosedJsonObject().workPackages);
    }

}
