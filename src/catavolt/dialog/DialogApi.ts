import {
    ActionParameters,
    Dialog,
    EditorDialog,
    Login,
    Menu,
    QueryParameters,
    Record,
    RecordSet,
    Redirection,
    Session,
    View,
    ViewDescriptor,
    ViewMode,
    Workbench,
    WorkbenchAction
} from "../models";
import {ClientMode} from "../client/Client";

export interface DialogApi {

    createSession(tenantId: string, login: Login): Promise<Session | Redirection>;

    getSession(tenantId: string, sessionId: string): Promise<Session>;

    deleteSession(tenantId: string, sessionId: string): Promise<{ sessionId: string }>;

    getWorkbenches(tenantId: string, sessionId: string): Promise<Array<Workbench>>;

    getWorkbench(tenantId: string, sessionId: string, workbenchId: string): Promise<Workbench>;

    getDialog(tenantId: string, sessionId: string, dialogId: string): Promise<Dialog>;

    deleteDialog(tenantId: string, sessionId: string, dialogId: string): Promise<{ dialogId: string }>;

    getActions(tenantId: string, sessionId: string, dialogId: string): Promise<Array<Menu>>;

    performAction(tenantId: string, sessionId: string, dialogId: string, actionId: string,
                  actionParameters: ActionParameters): Promise<{ actionId: string } | Redirection>;

    getWorkbenchActions(tenantId: string, sessionId: string, workbenchId: string): Promise<Array<WorkbenchAction>>;

    performWorkbenchAction(tenantId: string, sessionId: string, workbenchId: string, actionId: string): Promise<{ actionId: string } | Redirection>;

    getRedirection(tenantId: string, sessionId: string, redirectionId: string): Promise<Redirection>;

    getRecord(tenantId: string, sessionId: string, dialogId: string): Promise<Record>;

    putRecord(tenantId: string, sessionId: string, dialogId: string, record: Record): Promise<Record | Redirection>;

    //readProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, readSeq:number, readLength:number):Promise<>;

    //writeProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, data:string, append:boolean):Promise<>;

    getRecords(tenantId: string, sessionId: string, dialogId: string, queryParams: QueryParameters): Promise<RecordSet>;

    getAvailableValues(tenantId: string, sessionId: string, dialogId: string, propertyName: string): Promise<Array<any>>;

    getMode(tenantId: string, sessionId: string, dialogId: string): Promise<ViewMode>;

    changeMode(tenantId: string, sessionId: string, dialogId: string, mode: ViewMode): Promise<EditorDialog>;

    getView(tenantId: string, sessionId: string, dialogId: string): Promise<View>;

    changeView(tenantId: string, sessionId: string, dialogId: string, viewId: string): Promise<Dialog>;

    getViews(tenantId: string, sessionId: string, dialogId: string): Promise<Array<ViewDescriptor>>;

    setClientMode(clientMode: ClientMode): void;

    lastServiceActivity: Date;

}
