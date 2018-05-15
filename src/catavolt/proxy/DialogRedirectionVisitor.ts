import {Base64} from "../util/Base64";
import {DialogProxyTools} from "./DialogProxyTools";
import {RedirectionVisitor} from "./RedirectionVisitor";

/**
 *
 */
export class DialogRedirectionVisitor extends RedirectionVisitor {

    constructor(value: string | object) {
        super(value);
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

    // --- State Management --- //

    public deriveDialogIdsFromDialogNameAndRecordId() {
        let derivedDialogId = this.enclosedJsonObject()['dialogName'];
        if (!derivedDialogId) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        const referringObject = this.visitReferringObject();
        if (DialogProxyTools.isReferringDialogModel(referringObject)) {
            const referringDialogName = referringObject['dialogName'];
            if (referringDialogName) {
                referringObject['dialogId'] = referringDialogName;
            }
            // WARNING: Although this code sets the id on the dialog redirection, it is conditioned on the
            // referring object being a dialog redirection. This is because workbench redirections have a
            // synthetic record id that we do NOT want to include as part of the redirection id.
            const recordId = this.visitRecordId();
            // TODO: Fix the error in Dialog Service that returns null record ids as a string literal of "null"
            if (recordId && recordId !== 'null') {
                const recordIdEncoded = Base64.encodeUrlSafeString(recordId);
                derivedDialogId = `${derivedDialogId}@${recordIdEncoded}`;
            }
        }
        this.propagateDialogId(derivedDialogId);
    }

    public deriveDialogIdsFromDialogNameAndSuffix(suffix: string) {
        let derivedDialogId = this.enclosedJsonObject()['dialogName'];
        if (!derivedDialogId) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        if (suffix) {
            derivedDialogId = derivedDialogId + '_' + suffix;
        }
        this.propagateDialogId(derivedDialogId);
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

    public visitAndSetDialogId(dialogId: string) {
        this.enclosedJsonObject().dialogId = dialogId;
    }

    public visitDialogName(): string {
        return this.enclosedJsonObject().dialogName;
    }

    public visitAndSetDialogName(dialogName: string) {
        this.enclosedJsonObject().dialogName = dialogName;
    }

    public visitRecordId(): string {
        return this.enclosedJsonObject().recordId;
    }

}
