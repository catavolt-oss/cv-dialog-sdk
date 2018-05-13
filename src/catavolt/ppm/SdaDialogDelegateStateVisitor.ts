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

    public visitBaseUrl(): string {
        return this.enclosedJsonObject().baseUrl;
    }

    public visitAndSetBaseUrl(baseUrl: string) {
        this.enclosedJsonObject().baseUrl = baseUrl;
    }

    public visitBriefcase(): BriefcaseVisitor {
        return new BriefcaseVisitor(this.enclosedJsonObject().briefcase);
    }

    public visitPassword(): string {
        return this.enclosedJsonObject().password;
    }

    public visitAndSetPassword(password: string) {
        this.enclosedJsonObject().password = password;
    }

    public visitSelectedWorkPackageIds(): string[] {
        return this.enclosedJsonObject().selectedWorkPackageIds;
    }

    public visitAndClearSelectedWorkPackageIds() {
        return this.enclosedJsonObject().selectedWorkPackageIds = [];
    }

    public visitSessionId(): string {
        return this.enclosedJsonObject().sessionId;
    }

    public visitAndSetSessionId(sessionId: string) {
        this.enclosedJsonObject().sessionId = sessionId;
    }

    public visitTenantId(): string {
        return this.enclosedJsonObject().tenantId;
    }

    public visitAndSetTenantId(tenantId: string) {
        this.enclosedJsonObject().tenantId = tenantId;
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
