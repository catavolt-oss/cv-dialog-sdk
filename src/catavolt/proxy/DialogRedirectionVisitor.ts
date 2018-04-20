import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class DialogRedirectionVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
    }

    // --- State Management Helpers --- //

    public static propagateTenantIdAndSessionId(dialog: object, tenantId: string, sessionId: string) {
        (new DialogRedirectionVisitor(dialog)).propagateTenantIdAndSessionId(tenantId, sessionId);
    }

    public static visitId(dialog: object): string {
        return (new DialogRedirectionVisitor(dialog)).visitId();
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public propagateTenantIdAndSessionId(tenantId: string, sessionId: string) {
        this.enclosedJsonObject()['tenantId'] = tenantId;
        this.enclosedJsonObject()['sessionId'] = sessionId;
    }

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

}
