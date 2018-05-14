import {Base64} from "../util/Base64";
import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class DialogRedirectionVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('DialogRedirectionVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
    }

    // --- State Management Helpers --- //

    public static propagateDialogId(dialogRedirection: object, dialogId: string) {
        (new DialogRedirectionVisitor(dialogRedirection)).propagateDialogId(dialogId);
    }

    public static propagateTenantIdAndSessionId(dialogRedirection: object, tenantId: string, sessionId: string) {
        (new DialogRedirectionVisitor(dialogRedirection)).propagateTenantIdAndSessionId(tenantId, sessionId);
    }

    public static visitId(dialogRedirection: object): string {
        return (new DialogRedirectionVisitor(dialogRedirection)).visitId();
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

    public deriveDialogIdsFromDialogNameAndRecordId() {
        let dialogName = this.enclosedJsonObject()['dialogName'];
        if (!dialogName) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        const referringObject = this.visitReferringObject();
        if (DialogProxyTools.isReferringDialogModel(referringObject)) {
            const referringDialogName = referringObject['dialogName'];
            if (referringDialogName) {
                referringObject['dialogId'] = referringDialogName;
            }
            const recordId = this.visitRecordId();
            if (recordId) {
                const recordIdEncoded = Base64.encodeUrlSafeString(recordId);
                dialogName = `${dialogName}@${recordIdEncoded}`;
            }
        }
        this.propagateDialogId(dialogName);
    }

    public propagateDialogId(dialogId: string) {
        this.enclosedJsonObject()['id'] = dialogId;
        this.enclosedJsonObject()['dialogId'] = dialogId;
    }

    public propagateTenantIdAndSessionId(tenantId: string, sessionId: string) {
        this.enclosedJsonObject()['tenantId'] = tenantId;
        this.enclosedJsonObject()['sessionId'] = sessionId;
    }

    public visitDialogId(): string {
        return this.enclosedJsonObject().dialogId;
    }

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

    public visitRecordId(): string {
        return this.enclosedJsonObject().recordId;
    }

    public visitReferringDialogId(): string {
        return this.visitReferringObject()['dialogId'];
    }

    public visitReferringObject(): object {
        return this.enclosedJsonObject().referringObject;
    }

}
