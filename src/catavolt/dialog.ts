/**
 * Created by rburson on 8/29/17.
 */

import {Client, ClientMode, JsonClientResponse} from "./client";
import {Log, ObjUtil, StringDictionary, CvLocale} from "./util";
import {
    ActionParameters,
    ClientType,
    Dialog,
    DialogMessage,
    DialogRedirection,
    EditorDialog,
    Form,
    Login,
    Menu,
    ModelUtil,
    NullRedirection,
    QueryParameters,
    Record,
    RecordSet,
    Redirection,
    RedirectionUtil,
    Session,
    TypeNames,
    View,
    ViewDescriptor,
    ViewMode,
    Workbench,
    WorkbenchAction
} from "./models";
import {FetchClient} from "./ws";
import {PersistentClient} from "./persistence";

/**
 * Top-level entry point into the Catavolt API
 */
export class CatavoltApi {

    static DEFAULT_LOCALE:CvLocale = new CvLocale('en', 'US');

    private static _singleton:CatavoltApi;

    private static ONE_HOUR_IN_MILLIS:number = 60 * 60 * 1000;
    //defaults
    private static SERVER_URL:string = 'https://dialog.hxgn-api.net' ;
    private static SERVER_VERSION = 'v0';

    public dataLastChangedTime:Date = new Date(0);
    private _clientMode:ClientMode = ClientMode.ONLINE;
    private _dialogApi:DialogApi;
    private _session:Session;
    private _devicePropsDynamic:{[index:string]:()=>string;};
    private _devicePropsStatic:{[index:string]:string};

    private _locale:CvLocale = null;




    /* ********************
            Statics
     *********************** */

    /**
     * Get the default session time
     * @returns {number}
     */
    public static get defaultTTLInMillis():number {
        return CatavoltApi.ONE_HOUR_IN_MILLIS;
    }

    /**
     * Get the singleton instance of the CatavoltApi
     * @returns {CatavoltApi}
     */
    static get singleton():CatavoltApi {
        if (!CatavoltApi._singleton) {
            CatavoltApi._singleton = new CatavoltApi(CatavoltApi.SERVER_URL, CatavoltApi.SERVER_VERSION);
        }
        return CatavoltApi._singleton;
    }

    /**
     * Construct an CatavoltApi
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    private constructor(serverUrl:string, serverVersion:string) {

        if (CatavoltApi._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._devicePropsStatic = {};
        this._devicePropsDynamic = {};

        this.initDialogApi(serverUrl, serverVersion);

        CatavoltApi._singleton = this;
    }


    /* *****************
        Public Ops
       ******************* */

    /**
     * Add or replace a dynamic device property (func)
     * @param propName
     * @param propFn
     */
    addDynamicDeviceProp(propName:string, propFn:()=>string):void {
        this._devicePropsDynamic[propName] = propFn;
    }

    /**
     * Add or replace a static device property
     *
     * @param propName
     * @param propValue
     */
    addStaticDeviceProp(propName:string, propValue:string):void {
        this._devicePropsStatic[propName] = propValue;
    }

    /**
     * Get the preferred locale
     * @returns {CvLocale}
     */
    get locale():CvLocale {

        if(!this._locale) {
            const defaultLocale = this.session.tenantProperties['browserLocale'];
            if (defaultLocale) {
                try {
                    const localeJson = JSON.parse(defaultLocale);
                    if (localeJson['language']) {
                        this._locale = new CvLocale(localeJson['language'], localeJson['country']);
                    }
                } catch (err) {
                }
            }
        }

        if(!this._locale) {
            this._locale = CatavoltApi.DEFAULT_LOCALE;
        }

        return this._locale;
    }

    set locale(locale:CvLocale) {
        this._locale = locale;
    }

    /*@TODO*/
    changePasswordAndLogin(tenantId:string, clientType:ClientType, userId:string,
                           existingPassword:string, newPassword:string):Promise<Session | Redirection> {

        return Promise.reject(new Error('Not Yet Implemented'));
    }

    /**
     * Get the number of millis that the client will remain active between calls
     * to the server.
     * @returns {number}
     */
    get clientTimeoutMillis():number {
        const mins = this.session.tenantProperties['clientTimeoutMinutes'];
        return mins ? (Number(mins) * 60 * 1000) : CatavoltApi.defaultTTLInMillis;
    }

    /**
     * Get the currency symbol override if defined from the server.
     * @returns {string}
     */
    get currencySymbol():string {
        const currencySymbol = this.session.tenantProperties['currencySymbol'];
        return currencySymbol ? currencySymbol : null;
    }

    /**
     * Get the device props
     * @returns {{[p: string]: string}}
     */
    get deviceProps():{[index:string]:string} {

        const newProps:{[index:string]:string} = ObjUtil.addAllProps(this._devicePropsStatic, {});
        for(const attr in this._devicePropsDynamic) {
           newProps[attr] = this._devicePropsDynamic[attr]();
        }
        return newProps;

    }

    /**
     * Get the DialogApi instance
     * @returns {DialogApi}
     */
    get dialogApi():DialogApi {
        return this._dialogApi;
    }

    /**
     * Initialize a dialog service implementation for use by this CatavoltApi
     *
     * @param serverVersion
     * @param serverUrl
     */
    initDialogApi(serverUrl:string, serverVersion:string=CatavoltApi.SERVER_VERSION):void {

        this._dialogApi = new DialogService(new FetchClient(this._clientMode), serverUrl, serverVersion);

    }

    /**
     * Initialize an offline dialog service
     *
     * @param serverVersion
     * @param serverUrl
     */
    initPersistentApi(serverUrl:string, serverVersion:string):void {

        this._dialogApi = new DialogService(new PersistentClient(this._clientMode), serverUrl, serverVersion);

    }

    isOfflineMode():boolean {
        return this._clientMode === ClientMode.OFFLINE;
    }

    isPersistentClient():boolean {
        return (this.dialogApi as DialogService).client instanceof PersistentClient;
    }

    /**
     * Check for the availability of the given featureSet
     * @see FeatureSet
     * @param featureSet
     * @returns {boolean}
     */
    isFeatureSetAvailable(featureSet:FeatureSet):boolean {
        try {
            const currentVersion = AppVersion.getAppVersion(this.session.serverVersion);
            const featureMinimumVersion = FeatureVersionMap[featureSet];
            return featureMinimumVersion.isLessThanOrEqualTo(currentVersion);
        } catch(error) {
            Log.error('Failed to compare appVersions for feature ' + featureSet);
            Log.error(error);
            return false;
        }
    }

    /**
     * Checked logged in status
     * @returns {boolean}
     */
    get isLoggedIn() {
        return !!this._session;
    }

    /**
     * Log in and retrieve the Session
     *
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     *
     * @returns {Promise<Session | Redirection>}
     */
    login(tenantId:string,
          clientType:ClientType,
          userId:string,
          password:string):Promise<Session | Redirection> {

        if (this.isLoggedIn) {
            return Promise.reject(new Error('User is already logged in'));
        }

        const login:Login = {
            userId:userId,
            password: password,
            clientType:clientType,
            deviceProperties:this.deviceProps,
            type:TypeNames.LoginTypeName
        };

        return this.dialogApi.createSession(tenantId, login).then((result:Session | Redirection)=>{
            if(result.type === TypeNames.SessionTypeName) {
                this._session = <Session>result;
                return result;
            } else {
                return result;
            }
        });
    }

    /**
     * Logout and destroy the session
     * @returns {{sessionId:string}}
     */
    logout():Promise<{sessionId:string}> {

        if (!this.isLoggedIn) {
            return Promise.reject('User is already logged out');
        }

        return this.dialogApi.deleteSession(this.session.tenantId, this.session.id).then(result=>{
            this._session = null;
            return result;
        });
    }

    openDialogWithId(dialogId:string):Promise<Dialog> {

        return this.dialogApi.getDialog(this.session.tenantId, this.session.id, dialogId)
            .then((dialog:Dialog)=>{
                dialog.initialize(this);
                if(dialog.view instanceof Form) {
                    return dialog;
                } else {
                    throw new Error(`Unexpected top-level dialog view type: ${dialog.view.type}`);
                }
            });
    }

    openDialog(redirection:DialogRedirection):Promise<Dialog> {

        return this.openDialogWithId(redirection.dialogId);

    }

    toDialogOrRedirection(resultPr:Promise<{}>):Promise<Dialog | Redirection> {

        return resultPr.then((actionResult:{})=>{
            if(RedirectionUtil.isDialogRedirection(actionResult)) {
              return this.openDialog(actionResult as DialogRedirection) as Promise<Dialog | Redirection>;
            } else if(RedirectionUtil.isRedirection(actionResult)){
               return Promise.resolve(actionResult) as Promise<Dialog| Redirection>;
            } else {
                //@TODO - this shouldn't be a null redirection - what should it be?
                return Promise.resolve(actionResult as NullRedirection);
            }
        });

    }

    getRedirection(redirectionId:string):Promise<Redirection> {

        return this.dialogApi.getRedirection(this.session.tenantId, this.session.id, redirectionId);

    }

    /**
     * Open a {@link WorkbenchAction}
     * @param workbenchAction
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performWorkbenchAction(workbenchAction:WorkbenchAction):Promise<{actionId:string} | Redirection> {

        return this.performWorkbenchActionForId(workbenchAction.workbenchId, workbenchAction.id);

    }

    /**
     * Open a {@link WorkbenchWorkbenchAction}
     * @param workbenchId
     * @param workbenchActionId
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performWorkbenchActionForId(workbenchId:string, workbenchActionId:string):Promise<{actionId:string} | Redirection> {

        if (!this.isLoggedIn) {
            return Promise.reject(new Error('User is not logged in'));
        }

        return this.dialogApi.performWorkbenchAction(this.session.tenantId, this.session.id, workbenchId, workbenchActionId);
    }

    /**
     * Refresh the CatavoltApi
     *
     * @returns {Promise<Session>}
     */
    refreshSession(tenantId:string,
                   sessionId:string):Promise<Session> {

        return this.dialogApi.getSession(tenantId, sessionId).then(session=>{
            this._session = session;
            return session;
        });

    }


    /**
     * Time remaining before this session is expired by the server
     * @returns {number}
     */
    get remainingSessionTime():number {
        return this.clientTimeoutMillis - ((new Date()).getTime() - this.dialogApi.lastServiceActivity.getTime());
    }

    /**
     * Get the Session
     * @returns {Session}
     */
    get session():Session {
        return this._session;
    }

    /**
     * Return whether or not the session has expired
     * @returns {boolean}
     */
    get sessionHasExpired():boolean {
        return this.remainingSessionTime < 0;
    }

    setPersistentClient():void {
        this.initPersistentApi(CatavoltApi.SERVER_URL, CatavoltApi.SERVER_VERSION);
    }

    setOnlineClient():void {
        this.initDialogApi(CatavoltApi.SERVER_URL, CatavoltApi.SERVER_VERSION);
    }

    setOfflineMode():void {
        this._clientMode = ClientMode.OFFLINE;
        this.dialogApi.setClientMode(this._clientMode);
    }

    setOnlineMode():void {
        this._clientMode = ClientMode.ONLINE;
        this.dialogApi.setClientMode(this._clientMode);
    }

}

/*
 ************************** Dialog API ****************************
 */

export interface DialogApi {

    createSession(tenantId:string, login:Login):Promise<Session | Redirection>;

    getSession(tenantId:string, sessionId:string):Promise<Session>;

    deleteSession(tenantId:string, sessionId:string):Promise<{sessionId:string}>;

    getWorkbenches(tenantId:string, sessionId:string):Promise<Array<Workbench>>;

    getWorkbench(tenantId:string, sessionId:string, workbenchId:string):Promise<Workbench>;

    getDialog(tenantId:string, sessionId:string, dialogId:string):Promise<Dialog>;

    deleteDialog(tenantId:string, sessionId:string, dialogId:string):Promise<{dialogId:string}>;

    getActions(tenantId:string, sessionId:string, dialogId:string):Promise<Array<Menu>>;

    performAction(tenantId:string, sessionId:string, dialogId:string, actionId:string,
                  actionParameters:ActionParameters):Promise<{actionId:string} | Redirection>;

    getWorkbenchActions(tenantId:string, sessionId:string, workbenchId:string):Promise<Array<WorkbenchAction>>;

    performWorkbenchAction(tenantId:string, sessionId:string, workbenchId:string, actionId:string):Promise<{actionId:string} | Redirection>;

    getRedirection(tenantId:string, sessionId:string, redirectionId:string):Promise<Redirection>;

    getRecord(tenantId:string, sessionId:string, dialogId:string):Promise<Record>;

    putRecord(tenantId:string, sessionId:string, dialogId:string, record:Record):Promise<Record | Redirection>;

    //readProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, readSeq:number, readLength:number):Promise<>;

    //writeProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, data:string, append:boolean):Promise<>;

    getRecords(tenantId:string, sessionId:string, dialogId:string, queryParams:QueryParameters):Promise<RecordSet>;

    getAvailableValues(tenantId:string, sessionId:string, dialogId:string, propertyName:string):Promise<Array<any>>;

    getMode(tenantId:string, sessionId:string, dialogId:string):Promise<ViewMode>;

    changeMode(tenantId:string, sessionId:string, dialogId:string, mode:ViewMode):Promise<EditorDialog>;

    getView(tenantId:string, sessionId:string, dialogId:string):Promise<View>;

    changeView(tenantId:string, sessionId:string, dialogId:string, viewId:string):Promise<Dialog>;

    getViews(tenantId:string, sessionId:string, dialogId:string):Promise<Array<ViewDescriptor>>;

    setClientMode(clientMode:ClientMode):void;

    lastServiceActivity:Date;

}

export class DialogService implements DialogApi {

    private static SERVER:string = 'https://dialog.hxgn-api.net';

    readonly baseUrl:string;

    constructor(readonly client:Client, serverUrl:string=DialogService.SERVER, readonly apiVersion:string='v0') {
        this.baseUrl = `${serverUrl}/${apiVersion}`;
    }

    createSession(tenantId:string, login:Login):Promise<Session | Redirection> {

        return this.post(`tenants/${tenantId}/sessions`, login).then(
            jsonClientResponse=>(new DialogServiceResponse<Session>(jsonClientResponse)).responseValueOrRedirect()
        );

    }

    getSession(tenantId:string, sessionId:string):Promise<Session> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<Session>(jsonClientResponse)).responseValue()
        );

    }

    deleteSession(tenantId:string, sessionId:string):Promise<{sessionId:string}> {

        return this.d3lete(`tenants/${tenantId}/sessions/${sessionId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<{sessionId:string}>(jsonClientResponse)).responseValue()
        );

    }

    getWorkbenches(tenantId:string, sessionId:string):Promise<Array<Workbench>> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/workbenches`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<Workbench>>(jsonClientResponse)).responseValue()
        );

    }

    getWorkbench(tenantId:string, sessionId:string, workbenchId:string):Promise<Workbench> {

        return this.get(`tenants/{$tenantId}/sessions/{$sessionId}/workbenches/{$workbenchId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<Workbench>(jsonClientResponse)).responseValue()
        );

    }

    getRedirection(tenantId:string, sessionId:string, redirectionId:string):Promise<Redirection> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/redirections/${redirectionId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<Redirection>(jsonClientResponse)).responseValue()
        );

    }

    getDialog(tenantId:string, sessionId:string, dialogId:string):Promise<Dialog> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<Dialog>(jsonClientResponse)).responseValue()
        );

    }

    deleteDialog(tenantId:string, sessionId:string, dialogId:string):Promise<{dialogId:string}> {

        return this.d3lete(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}`).then(
            jsonClientResponse=>(new DialogServiceResponse<{dialogId:string}>(jsonClientResponse)).responseValue()
        );

    }

    getActions(tenantId:string, sessionId:string, dialogId:string):Promise<Array<Menu>> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<Menu>>(jsonClientResponse)).responseValue()
        );

    }

    performAction(tenantId:string, sessionId:string, dialogId:string, actionId:string,
                  actionParameters:ActionParameters):Promise<{actionId:string} | Redirection> {

        const encodedActionId = encodeURIComponent(actionId);
        return this.post(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions/${encodedActionId}`, actionParameters).then(
            jsonClientResponse=>(new DialogServiceResponse<{actionId:string}>(jsonClientResponse)).responseValueOrRedirect()
        );

    }

    getWorkbenchActions(tenantId:string, sessionId:string, workbenchId:string):Promise<Array<WorkbenchAction>> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<WorkbenchAction>>(jsonClientResponse)).responseValue()
        );

    }

    performWorkbenchAction(tenantId:string, sessionId:string, workbenchId:string, actionId:string):Promise<{actionId:string} | Redirection> {

        return this.post(`tenants/${tenantId}/sessions/${sessionId}/workbenches/${workbenchId}/actions/${actionId}`, {}).then(
            jsonClientResponse=>(new DialogServiceResponse<{actionId:string}>(jsonClientResponse)).responseValueOrRedirect()
        );

    }

    getRecord(tenantId:string, sessionId:string, dialogId:string):Promise<Record> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record`).then(
            jsonClientResponse=>(new DialogServiceResponse<Record>(jsonClientResponse)).responseValue()
        );

    }

     putRecord(tenantId:string, sessionId:string, dialogId:string, record:Record):Promise<Record | Redirection> {

         return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record`, record).then(
             jsonClientResponse=>(new DialogServiceResponse<Record | Redirection>(jsonClientResponse)).responseValueOrRedirect()
         );
     }

     getRecords(tenantId:string, sessionId:string, dialogId:string, queryParams:QueryParameters):Promise<RecordSet> {

        return this.post(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/records`, queryParams).then(
                jsonClientResponse=>(new DialogServiceResponse<RecordSet>(jsonClientResponse)).responseValue()
         );
    }

    getAvailableValues(tenantId:string, sessionId:string, dialogId:string, propertyName:string):Promise<Array<any>> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record/${propertyName}/availableValues`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<any>>(jsonClientResponse)).responseValue()
        );
    }

    getMode(tenantId:string, sessionId:string, dialogId:string):Promise<ViewMode> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/viewMode`).then(
            jsonClientResponse=>(new DialogServiceResponse<ViewMode>(jsonClientResponse)).responseValue()
        );
    }

    changeMode(tenantId:string, sessionId:string, dialogId:string, mode:ViewMode):Promise<EditorDialog> {

        return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/viewMode/${mode}`).then(
            jsonClientResponse=>(new DialogServiceResponse<EditorDialog>(jsonClientResponse)).responseValue()
        );

    }

     getView(tenantId:string, sessionId:string, dialogId:string):Promise<View> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/view`).then(
             jsonClientResponse=>(new DialogServiceResponse<View>(jsonClientResponse)).responseValue()
         );

     }

     changeView(tenantId:string, sessionId:string, dialogId:string, viewId:string):Promise<Dialog> {

        return this.put(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/selectedView/{viewId}`, {}).then(
             jsonClientResponse=>(new DialogServiceResponse<Dialog>(jsonClientResponse)).responseValue()
         );

     }

     getViews(tenantId:string, sessionId:string, dialogId:string):Promise<Array<ViewDescriptor>> {

         return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/availableViews`).then(
             jsonClientResponse=>(new DialogServiceResponse<Array<View>>(jsonClientResponse)).responseValue()
         );

    }

    get lastServiceActivity():Date {
        return this.client.lastActivity;
    }

    setClientMode(clientMode:ClientMode):void {
        this.client.setClientMode(clientMode);
    }

    /* Private methods */

    private get(path:string, queryParams?:StringDictionary):Promise<JsonClientResponse> {
        return this.client.getJson(`${DialogService.SERVER}/${this.apiVersion}`, path, queryParams);
    }

    private post<T>(path:string, body?:T):Promise<JsonClientResponse> {
        return this.client.postJson(`${DialogService.SERVER}/${this.apiVersion}`, path, body);
    }

    private d3lete(path:string):Promise<JsonClientResponse> {
        return this.client.deleteJson(`${DialogService.SERVER}/${this.apiVersion}`, path);
    }

    private put<T>(path:string, body?:T):Promise<JsonClientResponse> {
        return this.client.putJson(`${DialogService.SERVER}/${this.apiVersion}`, path, body);
    }

}

export interface DialogApiResponse<T> {

    responseValue():Promise<T>;
    responseValueOrRedirect():Promise<T | Redirection>;
    assertNoError():Promise<void>;

}

export class DialogServiceResponse<T> implements DialogApiResponse<T> {

    constructor(private readonly clientResponse:JsonClientResponse){}

    responseValue():Promise<T> {
        return new Promise((resolve, reject)=> {
            if(this.hasError) {
                reject(<DialogMessage>this.clientResponse.value);
            } else {
                this.fullfillJsonToModel<T>(this.clientResponse, resolve, reject);
            }
        });
    }

    responseValueOrRedirect():Promise<T | Redirection> {
        return new Promise((resolve, reject)=> {
            if(this.hasError) {
                reject(<DialogMessage>this.clientResponse.value);
            } else if(this.hasValue) {
                this.fullfillJsonToModel<T>(this.clientResponse, resolve, reject);
            } else {
                this.fullfillJsonToModel<Redirection>(this.clientResponse, resolve, reject);
            }
        });
    }

    assertNoError():Promise<void> {
        return new Promise((resolve, reject)=> {
            if(this.hasError) {
                reject(<DialogMessage>this.clientResponse.value);
            } else {
                resolve(undefined);
            }
        });
    }

    get hasValue():boolean {
        return this.clientResponse.statusCode >= 200 && this.clientResponse.statusCode < 300;
    }

    get hasRedirection():boolean {
        return this.clientResponse.statusCode >= 300 && this.clientResponse.statusCode < 400;
    }

    get hasError():boolean {
        return this.clientResponse.statusCode >= 400;
    }

    private fullfillJsonToModel<T>(clientResponse:JsonClientResponse, resolve, reject):void {

        ModelUtil.jsonToModel<T>(this.clientResponse.value).then(resolve).catch(reject);
    }

}

/**
 *****************************************************
 */

/* Begin Feature Versioning */

class AppVersion {

    public static getAppVersion(versionString:string):AppVersion {
        const [major, minor, patch] = versionString.split('.');
        return new AppVersion(Number(major || 0), Number(minor || 0), Number(patch || 0));
    }

    constructor(public major:number, public minor:number, public patch:number){}

    /**
     * Is 'this' version less than or equal to the supplied version?
     * @param anotherVersion - the version to compare to 'this' version
     * @returns {boolean}
     */
    public isLessThanOrEqualTo(anotherVersion:AppVersion):boolean {

        if(anotherVersion.major > this.major) {
            return true;
        } else if(anotherVersion.major == this.major) {
            if(anotherVersion.minor > this.minor) {
                return true;
            } else if(anotherVersion.minor == this.minor){
                return anotherVersion.patch >= this.patch;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
}

/**
 * Available Features
 */
export type FeatureSet = "View_Support" | "Unified_Search"

/* Map features to minimum app versions */
const FeatureVersionMap:{[featureSet:string]:AppVersion} = {
    "View_Support": AppVersion.getAppVersion("1.3.447"),
    "Unified_Search": AppVersion.getAppVersion("1.3.463")
};

/* End Feature Versioning */

/*
    Export the Catavolt Object
 */
export const Catavolt:CatavoltApi = CatavoltApi.singleton;
