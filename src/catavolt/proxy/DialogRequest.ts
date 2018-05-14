/**
 *
 */
import {StringDictionary} from "../util/StringDictionary";
import {ActionParametersVisitor} from "./ActionParametersVisitor";
import {DialogProxyTools} from "./DialogProxyTools";

export class DialogRequest {

    private static ACTIONS = 'actions';
    private static AVAILABLE_VALUES = 'availableValues';
    private static AVAILABLE_VIEWS = 'availableViews';
    private static CONTENT = 'content';
    private static DIALOGS = 'dialogs';
    private static RECORD = 'record';
    private static RECORDS = 'records';
    private static REDIRECTIONS = 'redirections';
    private static SELECTED_VIEW = 'selectedView';
    private static SESSIONS = 'sessions';
    private static TENANTS = 'tenants';
    private static VIEW_MODE = 'viewMode';
    private static WORKBENCHES = 'workbenches';

    private _baseUrl: string;
    private _body: StringDictionary;
    private _fetchClientParams: any[];
    private _queryParams: StringDictionary;
    private _resourcePath: string;
    private _resourcePathElems: string[];

    constructor(baseUrl: string, resourcePath: string, body: StringDictionary, queryParams: StringDictionary, formData: FormData, fetchClientParams: any[]) {
        this._baseUrl = baseUrl;
        this._resourcePath = resourcePath;
        this._resourcePathElems = resourcePath.split('/');
        this._body = body;
        this._queryParams = queryParams;
        this._fetchClientParams = fetchClientParams;
    }

    public static createFromDeleteRequest(baseUrl: string, resourcePath: string): DialogRequest {
        return new DialogRequest(baseUrl, resourcePath, null, null, null, [baseUrl, resourcePath]);
    }

    public static createFromGetRequest(baseUrl: string, resourcePath: string, queryParams: StringDictionary): DialogRequest {
        return new DialogRequest(baseUrl, resourcePath, null, queryParams, null, [baseUrl, resourcePath, queryParams]);
    }

    public static createFromPostRequest(baseUrl: string, resourcePath: string, body: StringDictionary): DialogRequest {
        return new DialogRequest(baseUrl, resourcePath, body, null, null, [baseUrl, resourcePath, body]);
    }

    public static createFromPutRequest(baseUrl: string, resourcePath: string, body: StringDictionary): DialogRequest {
        return new DialogRequest(baseUrl, resourcePath, body, null, null, [baseUrl, resourcePath, body]);
    }

    public static createFromPostMultipartRequest(baseUrl: string, resourcePath: string, formData: FormData): DialogRequest {
        return new DialogRequest(baseUrl, resourcePath, null, null, formData, [baseUrl, resourcePath, formData]);
    }

    public actionId(): string {
        return this._resourcePathElems[7];
    }

    public baseUrl(): string {
        return this._baseUrl;
    }

    public body(): StringDictionary {
        return this._body;
    }

    public deconstructDeleteSessionPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3]
        }
    }

    public deconstructGetDialogPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            dialogId: this._resourcePathElems[5]
        }
    }

    public deconstructGetRecordPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            dialogId: this._resourcePathElems[5]
        }
    }

    public deconstructGetRedirectionPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            redirectionId: this._resourcePathElems[5]
        }
    }

    public deconstructPostMenuActionPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            dialogId: this._resourcePathElems[5],
            actionId: this._resourcePathElems[7]
        }
    }

    public deconstructPostRecordsPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            dialogId: this._resourcePathElems[5]
        }
    }

    public deconstructPostSessionContentPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            contentId: this._resourcePathElems[5]
        }
    }

    public deconstructPostSessionsPath(): any {
        return {
            tenantId: this._resourcePathElems[1]
        }
    }

    public deconstructPostWorkbenchActionPath(): any {
        return {
            tenantId: this._resourcePathElems[1],
            sessionId: this._resourcePathElems[3],
            workbenchId: this._resourcePathElems[5],
            actionId: this._resourcePathElems[7]
        }
    }

    public dialogId(): string {
        return this._resourcePathElems[5];
    }

    public fetchClientParams(): any[] {
        return this._fetchClientParams;
    }

    public isCreateSessionPath(): boolean {
        return this._resourcePathElems.length === 3 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS;
    }

    public isDeleteSessionPath(): boolean {
        return this._resourcePathElems.length === 4 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS;
    }

    public isGetAvailableViewsPath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.AVAILABLE_VIEWS
        );
    }

    public isGetDialogPath(): boolean {
        return (
            this._resourcePathElems.length === 6 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS
        );
    }

    public isGetDialogPathWithDialogId(dialogId: string): boolean {
        if (!this.isGetDialogPath()) {
            return false;
        }
        const pathFields = this.deconstructGetDialogPath();
        return pathFields.dialogId === dialogId;
    }

    public isGetRecordPath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.RECORD
        );
    }

    public isGetRedirectionPath(): boolean {
        return (
            this._resourcePathElems.length === 6 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.REDIRECTIONS
        );
    }

    public isGetSelectedViewPath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.SELECTED_VIEW
        );
    }

    public isGetSessionPath(): boolean {
        return this._resourcePathElems.length === 4 && this._resourcePathElems[0] === DialogRequest.TENANTS && this._resourcePathElems[2] === DialogRequest.SESSIONS;
    }

    public isGetTenantPath(): boolean {
        return this._resourcePathElems.length === 2 && this._resourcePathElems[0] === DialogRequest.TENANTS;
    }

    public isGetTenantsPath(): boolean {
        return this._resourcePathElems.length === 1 && this._resourcePathElems[0] === DialogRequest.TENANTS;
    }

    public isGetViewModePath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.VIEW_MODE
        );
    }

    public isGetWorkbenchesPath(): boolean {
        return (
            this._resourcePathElems.length === 5 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.WORKBENCHES
        );
    }

    public isPostAvailableValuesPath(): boolean {
        return (
            this._resourcePathElems.length === 9 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.RECORD &&
            this._resourcePathElems[8] === DialogRequest.AVAILABLE_VALUES
        );
    }

    public isPostMenuActionPath(): boolean {
        return (
            this._resourcePathElems.length === 8 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.ACTIONS
        );
    }

    public isPostMenuActionPathWithActionId(actionId: string): boolean {
        if (!this.isPostMenuActionPath()) {
            return false;
        }
        const pathFields = this.deconstructPostMenuActionPath();
        return pathFields.actionId === actionId;
    }

    public isPostMenuActionPathWithDialogIdAndActionId(dialogId: string, actionId: string): boolean {
        if (!this.isPostMenuActionPath()) {
            return false;
        }
        const pathFields = this.deconstructPostMenuActionPath();
        return pathFields.dialogId === dialogId &&
            pathFields.actionId === actionId;
    }

    public isPostRecordsPath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.RECORDS
        );
    }

    public isPostRecordsPathWithDialogId(dialogId: string): boolean {
        if (!this.isPostRecordsPath()) {
            return false;
        }
        const pathFields = this.deconstructPostRecordsPath();
        return pathFields.dialogId === dialogId;
    }

    public isPostSessionPath(): boolean {
        return this._resourcePathElems.length === 3 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS;
    }

    public isPostSessionContentPath(): boolean {
        return (
            this._resourcePathElems.length === 6 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.CONTENT
        );
    }

    public isPostWorkbenchActionPath(): boolean {
        return (
            this._resourcePathElems.length === 8 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.WORKBENCHES &&
            this._resourcePathElems[6] === DialogRequest.ACTIONS
        );
    }

    public isPostWorkbenchActionPathWithActionId(actionId: string): boolean {
        if (!this.isPostWorkbenchActionPath()) {
            return false;
        }
        const pathFields = this.deconstructPostWorkbenchActionPath();
        return pathFields.actionId === actionId;
    }

    public isPutRecordPath(): boolean {
        return (
            this._resourcePathElems.length === 7 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.RECORD
        );
    }

    public isPutSelectedViewPath(): boolean {
        return (
            this._resourcePathElems.length === 8 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.SELECTED_VIEW
        );
    }

    public isPutViewModePath(): boolean {
        return (
            this._resourcePathElems.length === 8 &&
            this._resourcePathElems[0] === DialogRequest.TENANTS &&
            this._resourcePathElems[2] === DialogRequest.SESSIONS &&
            this._resourcePathElems[4] === DialogRequest.DIALOGS &&
            this._resourcePathElems[6] === DialogRequest.VIEW_MODE
        );
    }

    public resourcePath(): string {
        return this._resourcePath;
    }

    public resourcePathElems(): string[] {
        return this._resourcePathElems;
    }

    public sessionId(): string {
        return this._resourcePathElems[3];
    }

    public targetId(): string {
        const targetIds = this.targetIds();
        if (targetIds) {
            return targetIds[0];
        }
        return null;
    }

    public targetIds(): string[] {
        if (DialogProxyTools.isActionParametersModel(this.body())) {
            return ActionParametersVisitor.visitTargetsValue(this.body());
        }
        return null;
    }

    public tenantId(): string {
        return this._resourcePathElems[1];
    }

}
