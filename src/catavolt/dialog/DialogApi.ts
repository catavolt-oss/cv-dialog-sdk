import {ClientListener} from "../client/ClientListener";
import { StreamProducer } from '../io/StreamProducer';
import {
    ActionParameters,
    Attachment,
    Dialog,
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
import {CvLocale} from "../util";

export interface DialogApi {
    lastServiceActivity: Date;

    addAttachment(tenantId: string, sessionId: string, dialogId: string, attachment: Attachment): Promise<void>;

    addClientListener(clientListener:ClientListener, locale:CvLocale);

    removeClientListener(clientListener:ClientListener);

    createSession(tenantId: string, login: Login): Promise<Session | Redirection>;

    getSession(tenantId: string, sessionId: string): Promise<Session>;

    deleteSession(tenantId: string, sessionId: string): Promise<{ sessionId: string }>;

    getContent(
        tenantId: string,
        sessionId: string,
        contentId: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty>;

    getWorkbenches(tenantId: string, sessionId: string): Promise<Array<Workbench>>;

    getWorkbench(tenantId: string, sessionId: string, workbenchId: string): Promise<Workbench>;

    getDialog(tenantId: string, sessionId: string, dialogId: string): Promise<Dialog>;

    deleteDialog(tenantId: string, sessionId: string, dialogId: string): Promise<{ dialogId: string }>;

    getActions(tenantId: string, sessionId: string, dialogId: string): Promise<Array<Menu>>;

    isOffline(userInfo:{}): Promise<boolean>;

    performAction(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        actionId: string,
        actionParameters: ActionParameters
    ): Promise<Redirection>;

    getWorkbenchActions(tenantId: string, sessionId: string, workbenchId: string): Promise<Array<WorkbenchAction>>;

    performWorkbenchAction(
        tenantId: string,
        sessionId: string,
        workbenchId: string,
        actionId: string
    ): Promise<Redirection>;

    getRedirection(tenantId: string, sessionId: string, redirectionId: string): Promise<Redirection>;

    getRecord(tenantId: string, sessionId: string, dialogId: string): Promise<Record>;

    getEditorProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty>;

    getQueryProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        readLargePropertyParams: ReadLargePropertyParameters
    ): Promise<LargeProperty>;

    writeProperty(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        writeLargePropertyParams: WriteLargePropertyParameters
    ): Promise<{ propertyName: string }>;

    propertyChange(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string,
        propertyValue: any,
        pendingWrites: Record
    ): Promise<Record>;

    putRecord(tenantId: string, sessionId: string, dialogId: string, record: Record): Promise<Record | Redirection>;

    getRecords(tenantId: string, sessionId: string, dialogId: string, queryParams: QueryParameters): Promise<RecordSet>;

    getAvailableValues(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        propertyName: string
    ): Promise<Array<any>>;

    getMode(tenantId: string, sessionId: string, dialogId: string): Promise<ViewMode>;

    changeMode(
        tenantId: string,
        sessionId: string,
        dialogId: string,
        mode: ViewMode
    ): Promise<EditorDialog | Redirection>;

    getView(tenantId: string, sessionId: string, dialogId: string): Promise<View>;

    changeView(tenantId: string, sessionId: string, dialogId: string, viewId: string): Promise<Dialog>;

    getViews(tenantId: string, sessionId: string, dialogId: string): Promise<Array<ViewDescriptor>>;

    streamUrl(tentantId: string, sessionId: string, url: string): Promise<StreamProducer>;
}
