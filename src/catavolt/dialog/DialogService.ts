import { Client } from '../client/Client';
import {ClientListener} from "../client/ClientListener";
import { JsonClientResponse } from '../client/JsonClientResponse';
import { StreamProducer } from '../io/StreamProducer';
import {
    ActionParameters,
    Attachment,
    DefaultModelUtil,
    Dialog,
    DialogMessage,
    EditorDialog,
    LargeProperty,
    Login,
    Menu,
    QueryParameters,
    ReadLargePropertyParameters,
    Record,
    RecordSet,
    Redirection,
    Session,
    View,
    ViewDescriptor,
    ViewMode,
    Workbench,
    WorkbenchAction,
    WriteLargePropertyParameters
} from '../models';
import {Base64, CvLocale} from '../util';
import { StringDictionary } from '../util/StringDictionary';
import { DialogApi } from './DialogApi';

export class DialogService implements DialogApi {
    public readonly baseUrl: string;

    constructor(readonly client: Client, serverUrl: string, readonly apiVersion) {
        this.baseUrl = `${serverUrl}/${apiVersion}`;
    }

    // @TODO
    public addAttachment(tenantId: string, sessionId: string, dialogId: string, attachment: Attachment): Promise<void> {
        return Promise.resolve(null);
    }

    public addClientListener(clientListener:ClientListener, locale:CvLocale) {
        this.client.addClientListener(clientListener, locale);
    }

    public removeClientListener(clientListener:ClientListener) {
        this.client.removeClientListener(clientListener);
    }

    public createSession(tenantId: string, login: Login): Promise<Session | Redirection> {
        return this.post(`tenants/${tenantId}/sessions`, login).then(jsonClientResponse =>
            new DialogServiceResponse<Session>(jsonClientResponse).responseValueOrRedirect()
        );
    }
    public getSession(tenantId: string, sessionId: string): Promise<Session> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}`).then(jsonClientResponse =>
            new DialogServiceResponse<Session>(jsonClientResponse).responseValue()
        );
    }

    public deleteSession(tenantId: string, sessionId: string): Promise<{ sessionId: string }> {
        return this.d3lete(`tenants/${tenantId}/sessions/${sessionId}`).then(jsonClientResponse =>
            new DialogServiceResponse<{ sessionId: string }>(jsonClientResponse).responseValue()
        );
    }

    public getContent(
        tenantId: string,
        sessionId: string,
        contentId: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty> {
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/content/${contentId}`,
            readLargePropertyParams
        ).then(jsonClientResponse => new DialogServiceResponse<LargeProperty>(jsonClientResponse).responseValue());
    }

    public getWorkbenches(tenantId: string, sessionId: string): Promise<Array<Workbench>> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/workbenches`).then(jsonClientResponse =>
            new DialogServiceResponse<Array<Workbench>>(jsonClientResponse).responseValue()
        );
    }

    public getWorkbench(tenantId: string, sessionId: string, workbenchId: string): Promise<Workbench> {
        return this.get(`tenants/{$tenantId}/sessions/{$sessionId}/workbenches/{$workbenchId}`).then(
            jsonClientResponse => new DialogServiceResponse<Workbench>(jsonClientResponse).responseValue()
        );
    }

    public getRedirection(tenantId: string, sessionId: string, redirectionId: string): Promise<Redirection> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/redirections/${redirectionId}`).then(
            jsonClientResponse => new DialogServiceResponse<Redirection>(jsonClientResponse).responseValue()
        );
    }

    public getDialog(tenantId: string, sessionId: string, dialogId: string): Promise<Dialog> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`).then(jsonClientResponse =>
            new DialogServiceResponse<Dialog>(jsonClientResponse).responseValue()
        );
    }

    public deleteDialog(tenantId: string, sessionId: string, dialogId: string): Promise<{ dialogId: string }> {
        return this.d3lete(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`).then(jsonClientResponse =>
            new DialogServiceResponse<{ dialogId: string }>(jsonClientResponse).responseValue()
        );
    }

    public getActions(tenantId: string, sessionId: string, dialogId: string): Promise<Array<Menu>> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions`).then(
            jsonClientResponse => new DialogServiceResponse<Array<Menu>>(jsonClientResponse).responseValue()
        );
    }

    public performAction(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        actionId: string,
        actionParameters: ActionParameters
    ): Promise<Redirection> {
        const encodedActionId = encodeURIComponent(actionId);
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions/${encodedActionId}`,
            actionParameters
        ).then(jsonClientResponse => new DialogServiceResponse<Redirection>(jsonClientResponse).responseValue());
    }

    public getWorkbenchActions(
        tenantId: string,
        sessionId: string,
        workbenchId: string
    ): Promise<Array<WorkbenchAction>> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions`).then(
            jsonClientResponse => new DialogServiceResponse<Array<WorkbenchAction>>(jsonClientResponse).responseValue()
        );
    }

    public performWorkbenchAction(
        tenantId: string,
        sessionId: string,
        workbenchId: string,
        actionId: string
    ): Promise<Redirection> {
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions/${actionId}`,
            {}
        ).then(jsonClientResponse => new DialogServiceResponse<Redirection>(jsonClientResponse).responseValue());
    }

    public getRecord(tenantId: string, sessionId: string, dialogId: string): Promise<Record> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record`).then(
            jsonClientResponse => new DialogServiceResponse<Record>(jsonClientResponse).responseValue()
        );
    }

    public putRecord(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        record: Record
    ): Promise<Record | Redirection> {
        return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record`, record).then(
            jsonClientResponse =>
                new DialogServiceResponse<Record | Redirection>(jsonClientResponse).responseValueOrRedirect()
        );
    }

    public getRecords(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        queryParams: QueryParameters
    ): Promise<RecordSet> {
        return this.post(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/records`, queryParams).then(
            jsonClientResponse => new DialogServiceResponse<RecordSet>(jsonClientResponse).responseValue()
        );
    }

    public getEditorProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty> {
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record/${propertyName}`,
            readLargePropertyParams
        ).then(jsonClientResponse => new DialogServiceResponse<LargeProperty>(jsonClientResponse).responseValue());
    }

    public getQueryProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty> {
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/records/${propertyName}`,
            readLargePropertyParams
        ).then(jsonClientResponse => new DialogServiceResponse<LargeProperty>(jsonClientResponse).responseValue());
    }

    public writeProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        writeLargePropertyParams: WriteLargePropertyParameters
    ): Promise<{ propertyName: string }> {
        return this.put(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record/${propertyName}`,
            writeLargePropertyParams
        ).then(jsonClientResponse =>
            new DialogServiceResponse<{ propertyName: string }>(jsonClientResponse).responseValue()
        );
    }

    // @TODO
    public propertyChange(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        propertyValue: any,
        pendingWrites: Record
    ): Promise<Record> {
        /*
        return this.post(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/records/${propertyName}`, propertyChangeParams
        ).then(jsonClientResponse => new DialogServiceResponse<LargeProperty>(jsonClientResponse).responseValue());
        */
        return Promise.resolve(null);
    }

    public getAvailableValues(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string
    ): Promise<Array<any>> {
        return this.get(
            `tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record/${propertyName}/availableValues`
        ).then(jsonClientResponse => new DialogServiceResponse<Array<any>>(jsonClientResponse).responseValue());
    }

    public openContentStream(tenantId: string, sessionId: string, contentId: string): Promise<StreamProducer> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/content/${contentId}`).then(jsonClientResponse =>
            new DialogServiceResponse<StreamProducer>(jsonClientResponse).responseValue()
        );
    }

    public getMode(tenantId: string, sessionId: string, dialogId: string): Promise<ViewMode> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/viewMode`).then(
            jsonClientResponse => new DialogServiceResponse<ViewMode>(jsonClientResponse).responseValue()
        );
    }

    public changeMode(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        mode: ViewMode
    ): Promise<EditorDialog | Redirection> {
        return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/viewMode/${mode}`).then(
            jsonClientResponse =>
                new DialogServiceResponse<EditorDialog | Redirection>(jsonClientResponse).responseValueOrRedirect()
        );
    }

    public getView(tenantId: string, sessionId: string, dialogId: string): Promise<View> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/view`).then(jsonClientResponse =>
            new DialogServiceResponse<View>(jsonClientResponse).responseValue()
        );
    }

    public changeView(tenantId: string, sessionId: string, dialogId: string, viewId: string): Promise<Dialog> {
        return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/selectedView/{viewId}`, {}).then(
            jsonClientResponse => new DialogServiceResponse<Dialog>(jsonClientResponse).responseValue()
        );
    }

    public getViews(tenantId: string, sessionId: string, dialogId: string): Promise<Array<ViewDescriptor>> {
        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/availableViews`).then(
            jsonClientResponse => new DialogServiceResponse<Array<View>>(jsonClientResponse).responseValue()
        );
    }

    public streamUrl(tentantId: string, sessionId: string, url: string): Promise<StreamProducer> {
        return this.stream(url);
    }

    public isAnyUserInBriefcaseMode(tenantId: string): Promise<boolean> {
        return this.client.isAnyUserInBriefcaseMode(tenantId);
    }

    public isUserInBriefcaseMode(userInfo:{}): Promise<boolean> {
        return this.client.isUserInBriefcaseMode(userInfo);
    }

    get lastServiceActivity(): Date {
        return this.client.lastActivity;
    }

    /* Private methods */

    private get(path: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        return this.client.getJson(`${this.baseUrl}`, path, queryParams);
    }

    private post<T>(path: string, body?: T): Promise<JsonClientResponse> {
        return this.client.postJson(`${this.baseUrl}`, path, body);
    }

    private d3lete(path: string): Promise<JsonClientResponse> {
        return this.client.deleteJson(`${this.baseUrl}`, path);
    }

    private put<T>(path: string, body?: T): Promise<JsonClientResponse> {
        return this.client.putJson(`${this.baseUrl}`, path, body);
    }

    private stream(url: string): Promise<StreamProducer> {
        return this.client.openStream(url);
    }
}

interface DialogApiResponse<T> {
    responseValue(): Promise<T>;

    responseValueOrRedirect(): Promise<T | Redirection>;

    assertNoError(): Promise<void>;
}

class DialogServiceResponse<T> implements DialogApiResponse<T> {
    constructor(private readonly clientResponse: JsonClientResponse) {}

    public responseValue(): Promise<T> {
        return new Promise((resolve, reject) => {
            if (this.hasError) {
                reject(this.clientResponse.value as DialogMessage);
            } else {
                this.fullfillJsonToModel<T>(this.clientResponse, resolve, reject);
            }
        });
    }

    public responseValueOrRedirect(): Promise<T | Redirection> {
        return new Promise((resolve, reject) => {
            if (this.hasError) {
                reject(this.clientResponse.value as DialogMessage);
            } else if (this.hasValue) {
                this.fullfillJsonToModel<T>(this.clientResponse, resolve, reject);
            } else {
                this.fullfillJsonToModel<Redirection>(this.clientResponse, resolve, reject);
            }
        });
    }

    public assertNoError(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.hasError) {
                reject(this.clientResponse.value as DialogMessage);
            } else {
                resolve(undefined);
            }
        });
    }

    get hasValue(): boolean {
        return this.clientResponse.statusCode >= 200 && this.clientResponse.statusCode < 300;
    }

    get hasRedirection(): boolean {
        return this.clientResponse.statusCode >= 300 && this.clientResponse.statusCode < 400;
    }

    get hasError(): boolean {
        return this.clientResponse.statusCode >= 400;
    }

    private fullfillJsonToModel<T>(clientResponse: JsonClientResponse, resolve, reject): void {
        DefaultModelUtil.jsonToModel<T>(this.clientResponse.value)
            .then(resolve)
            .catch(reject);
    }
}
