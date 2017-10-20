/**
 * Created by rburson on 8/29/17.
 */

import {Client, ClientMode, JsonClientResponse} from "../client";
import {DataUrl, DateTimeValue, DateValue, Log, ObjUtil, TimeValue} from "../util";
import {
    ClientType, Dialog, DialogMessage, DialogRedirection, FormViewType, Login, Menu, PropertyDef, Property, Redirection,
    Session, Tenant,
    WebRedirection,
    Workbench,
    WorkbenchAction, WorkbenchRedirection, CodeRef, ObjectRef, GeoFix, GeoLocation, NavRequest
} from "../models";
import {FormContext} from "../dialog";
import {FetchClient} from "../ws";
import {OfflineClient} from "../offline";
import * as moment from 'moment';
import * as numeral from "numeral";

/**
 * Top-level entry point into the Catavolt API
 */
export class AppContext {

    private static _singleton:AppContext;

    private static ONE_HOUR_IN_MILLIS:number = 60 * 60 * 1000;

    //defaults
    private static SERVER_URL:string = 'https://dialog.hxgn-api.net' ;
    private static SERVER_VERSION = 'v0';

    public lastMaintenanceTime:Date = new Date(0);
    private _dialogApi:DialogApi;
    private _session:Session;
    private _devicePropsDynamic:{[index:string]:()=>string;};
    private _devicePropsStatic:{[index:string]:string};


    /* ********************
            Statics
     *********************** */

    /**
     * Get the default session time
     * @returns {number}
     */
    public static get defaultTTLInMillis():number {
        return AppContext.ONE_HOUR_IN_MILLIS;
    }

    /**
     * Get the singleton instance of the AppContext
     * @returns {AppContext}
     */
    static get singleton():AppContext {
        if (!AppContext._singleton) {
            AppContext._singleton = new AppContext(AppContext.SERVER_VERSION, AppContext.SERVER_URL);
        }
        return AppContext._singleton;
    }

    /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    private constructor(serverVersion:string, serverUrl:string) {

        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._devicePropsStatic = {};
        this._devicePropsDynamic = {};

        this.initDialogApi(serverVersion, serverUrl);

        AppContext._singleton = this;
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
     * Get the json representation of this client's locale.  The server pulls this value from the agent string
     * and returns it to the client.
     * @returns {string}
     */
    get browserLocaleJson():string {

        return this.session.tenantProperties['browserLocale'];
    }

    /**
     * Get the number of millis that the client will remain active between calls
     * to the server.
     * @returns {number}
     */
    get clientTimeoutMillis():number {
        const mins = this.session.tenantProperties['clientTimeoutMinutes'];
        return mins ? (Number(mins) * 60 * 1000) : AppContext.defaultTTLInMillis;
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
     * Get a Workbench by workbenchId
     * @param workbenchId
     * @returns {Promise<Workbench>}
     */
    getWorkbench(workbenchId:string):Promise<Workbench> {

        if (!this.isLoggedIn) {
            return Promise.reject(new Error('User is not logged in'));
        }

        return this.dialogApi.getWorkbench(this.session.tenantId, this.session.id, workbenchId);
    }

    /**
     * Get the list of Workbenches
     *
     * @returns {Array<Workbench>}
     */
    getWorkbenches():Promise<Array<Workbench>> {

        if (!this.isLoggedIn) {
            return Promise.reject(new Error('User is not logged in'));
        }

        return this.dialogApi.getWorkbenches(this.session.tenantId, this.session.id);
    }


    /**
     * Initialize a dialog service implementation for use by this AppContext
     *
     * @param serverVersion
     * @param serverUrl
     */
    initDialogApi(serverVersion:string, serverUrl:string):void {

        this._dialogApi = new DialogService(serverVersion, this.getClient(ClientMode.REMOTE), serverUrl);

    }

    /**
     * Initialize an offline dialog service
     *
     * @param serverVersion
     * @param serverUrl
     */
    initOfflineApi(serverVersion:string, serverUrl:string):void {

        this._dialogApi = new DialogService(serverVersion, this.getClient(ClientMode.OFFLINE), serverUrl);

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
     * @param serverUrl
     * @param serverVersion
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
            deviceProperties:this.deviceProps
        };

        return this.dialogApi.createSession(tenantId, login).then((result:Session | Redirection)=>{
            if(result.hasOwnProperty('redirectionType')) {
                //it's a Redirection
                return result;
            } else {
                this._session = <Session>result;
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

    /**
     * Open a redirection
     *
     * @param redirection
     * @param actionSource
     * @returns {Promise<NavRequest>}
     */
    openRedirection(redirection:Redirection):Promise<NavRequest> {
        return this.fromRedirection(redirection);
    }

    /**
     * Open a {@link WorkbenchLaunchAction}
     * @param launchAction
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performLaunchAction(workbench:Workbench, launchAction:WorkbenchAction):Promise<{actionId:string} | Redirection> {

        return this.performLaunchActionForId(workbench.id, launchAction.id);

    }

    /**
     * Open a {@link WorkbenchLaunchAction}
     * @param workbenchId
     * @param launchActionId
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performLaunchActionForId(workbenchId:string, launchActionId:string):Promise<{actionId:string} | Redirection> {

        if (!this.isLoggedIn) {
            return Promise.reject(new Error('User is not logged in'));
        }

        return this.dialogApi.performWorkbenchAction(this.session.tenantId, this.session.id, workbenchId, launchActionId);
    }

    /**
     * Refresh the AppContext
     *
     * @returns {Promise<Session>}
     */
    refreshContext(tenantId:string,
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

    /* *****************
       Private Ops
     ******************* */

    private fromRedirection(redirection:Redirection):Promise<NavRequest> {

        if(redirection.redirectionType === 'hxgn.api.dialog.DialogRedirection') {
           this.dialogApi.getDialog(this.session.tenantId, this.session.id, (<DialogRedirection>redirection).dialogId)
               .then((dialog:Dialog)=>{
                  if(dialog.view.viewType === FormViewType) {
                    //return new FormContext(dialog);
                  }
               });
        } else if(redirection.redirectionType === 'hxgn.api.dialog.WebRedirection') {
            return Promise.resolve(<WebRedirection>redirection);
        } else if(redirection.redirectionType === 'hxgn.api.dialog.WorkbenchRedirection') {
            return this.getWorkbench((<WorkbenchRedirection>redirection).workbenchId);
        } else {
            return Promise.reject(new Error(`Unrecognized type of Redirection ${ObjUtil.formatRecAttr(redirection)}`));
        }

    }

    private getClient(clientType:ClientMode):Client {
        if(clientType === ClientMode.REMOTE) {
            return new FetchClient();
        } else if(clientType === ClientMode.OFFLINE) {
            return new OfflineClient();
        }
    }

}


/*
 ************************** Dialog API ****************************
 */

export interface DialogApi {

    getTenants():Promise<Array<Tenant>>;

    getSessions(tenantId:string):Promise<Array<Session>>;

    createSession(tenantId:string, login:Login):Promise<Session | Redirection>;

    getSession(tenantId:string, sessionId:string):Promise<Session>;

    deleteSession(tenantId:string, sessionId:string):Promise<{sessionId:string}>;

    getWorkbenches(tenantId:string, sessionId:string):Promise<Array<Workbench>>;

    getWorkbench(tenantId:string, sessionId:string, workbenchId:string):Promise<Workbench>;

    getDialogs(tenantId:string, sessionId:string):Promise<Array<Dialog>>;

    getDialog(tenantId:string, sessionId:string, dialogId:string):Promise<Dialog>;

    deleteDialog(tenantId:string, sessionId:string, dialogId:string):Promise<{dialogId:string}>;

    getActions(tenantId:string, sessionId:string, dialogId:string):Promise<Array<Menu>>;

    performAction(tenantId:string, sessionId:string, dialogId:string, actionId:string):Promise<{actionId:string} | Redirection>;

    getWorkbenchActions(tenantId:string, sessionId:string, workbenchId:string):Promise<Array<WorkbenchAction>>;

    performWorkbenchAction(tenantId:string, sessionId:string, workbenchId:string, actionId:string):Promise<{actionId:string} | Redirection>;

    /*getRecord(tenantId:string, sessionId:string, dialogId:string):Promise<Record>;

    putRecord(tenantId:string, sessionId:string, dialogId:string, record:Record):Promise<Record | Redirection>;

    getRecords(tenantId:string, sessionId:string, dialogId:string):Promise<Array<Record>>;

    getMode(tenantId:string, sessionId:string, dialogId:string):Promise<{mode:string}>;

    changeMode(tenantId:string, sessionId:string, dialogId:string, mode:DialogMode):Promise<Dialog>;

    getView(tenantId:string, sessionId:string, dialogId:string):Promise<View>;

    changeView(tenantId:string, sessionId:string, dialogId:string):Promise<Dialog>;

    getViews(tenantId:string, sessionId:string, dialogId:string):Promise<Array<View>>;

    getColumns(tenantId:string, sessionId:string, dialogId:string):Promise<Array<Column>>;

    changeColumns(tenantId:string, sessionId:string, dialogId:string):Promise<Dialog>;
    */

    lastServiceActivity:Date;

}

export class DialogService implements DialogApi {

    private static SERVER:string = 'https://dialog.hxgn-api.net' ;

    readonly baseUrl:string;

    constructor(readonly apiVersion:string='v0', readonly client:Client, serverUrl=DialogService.SERVER) {
        this.baseUrl = `${serverUrl}/${apiVersion}`;
    }

    getTenants():Promise<Array<Tenant>>{

        return this.get('tenants').then(
            jsonClientResponse=>(new DialogServiceResponse<Array<Tenant>>(jsonClientResponse)).responseValue()
        );

    }

    getSessions(tenantId:string):Promise<Array<Session>> {

        return this.get(`tenants/${tenantId}/sessions`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<Session>>(jsonClientResponse)).responseValue()
        );

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

    getDialogs(tenantId:string, sessionId:string):Promise<Array<Dialog>> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs`).then(
            jsonClientResponse=>(new DialogServiceResponse<Array<Dialog>>(jsonClientResponse)).responseValue()
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

    performAction(tenantId:string, sessionId:string, dialogId:string, actionId:string):Promise<{actionId:string} | Redirection> {

        return this.post(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/actions/${actionId}`, {}).then(
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

    get lastServiceActivity():Date {
        return this.client.lastActivity;
    }


    /* Private methods */

    private get(path:string):Promise<JsonClientResponse> {
        return this.client.getJson(`${DialogService.SERVER}/${this.apiVersion}`, path);
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
            if(this.hasMessage) {
                reject(<DialogMessage>this.clientResponse.value);
            } else {
                resolve(<T>this.clientResponse.value);
            }
        });
    }

    responseValueOrRedirect():Promise<T | Redirection> {
        return new Promise((resolve, reject)=> {
            if(this.hasMessage) {
                reject(<DialogMessage>this.clientResponse.value);
            } else if(this.hasValue) {
                resolve(<T>this.clientResponse.value);
            } else {
                resolve(<Redirection>this.clientResponse.value);
            }
        });
    }

    assertNoError():Promise<void> {
        return new Promise((resolve, reject)=> {
            if(this.hasMessage) {
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

    get hasMessage():boolean {
        return this.clientResponse.statusCode >= 400;
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


/**
 * ************* Dialog Support Classes ********************
 */

export interface ActionSource {

    fromActionSource:ActionSource;
    virtualPathSuffix:Array<string>;

}

export class ContextAction implements ActionSource {

    constructor(public actionId:string,
                public objectId:string,
                public fromActionSource:ActionSource) {
    }

    get virtualPathSuffix():Array<string> {
        return [this.objectId, this.actionId];
    }
}


/**
 * ************* Binary Support ********************
 */

/**
 * Represents a binary value
 */
export interface Binary {

    /**
     * Return a url resprenting this binary value
     */
    toUrl():string;
}

/**
 * Represents a base64 encoded binary
 */
export class EncodedBinary implements Binary {

    constructor(private _data:string, private _mimeType?:string) {
    }

    /**
     * Get the base64 encoded data
     * @returns {string}
     */
    get data():string {
        return this._data;
    }

    /**
     * Get the mime-type
     * @returns {string|string}
     */
    get mimeType():string {
        return this._mimeType || 'application/octet-stream';
    }

    /**
     * Returns a 'data url' representation of this binary, including the encoded data
     * @returns {string}
     */
    toUrl():string {
        return DataUrl.createDataUrl(this.mimeType, this.data);
    }
}

/**
 * Represents a remote binary
 */
export class UrlBinary implements Binary {

    constructor(private _url:string) {
    }

    get url():string {
        return this._url;
    }

    /**
     * Returns a url that 'points to' the binary data
     * @returns {string}
     */
    toUrl():string {
        return this.url;
    }
}

/**
 * ************* Property Formatting ********************
 */

/**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */
class PrivatePropFormats {
    static decimalFormat: string[] = ["0,0", "0,0.0", "0,0.00", "0,0.000", "0,0.0000", "0,0.00000", "0,0.000000", "0,0.0000000", "0,0.00000000", "0,0.000000000", "0,0.0000000000"];
    static decimalFormatGeneric:string = "0,0.[0000000000000000000000000]";
    static moneyFormat: string[] = ["$0,0", "$0,0.0", "$0,0.00", "$0,0.000", "$0,0.0000", "$0,0.00000", "$0,0.000000", "$0,0.0000000", "$0,0.00000000", "$0,0.000000000", "$0,0.0000000000"];
    static moneyFormatGeneric:string = "$0,0.[0000000000000000000000000]";
    static percentFormat: string[] = ["0,0%", "0,0%", "0,0%", "0,0.0%", "0,0.00%", "0,0.000%", "0,0.0000%", "0,0.00000%", "0,0.000000%", "0,0.0000000%", "0,0.00000000%"];
    static percentFormatGeneric:string = "0,0.[0000000000000000000000000]%";
    static wholeFormat:string = "0,0";
}

export class PropFormatter {
    // For numeral format options, see: http://numeraljs.com/

    // Default format for money at varying decimal lengths.
    static decimalFormat: string[] = PrivatePropFormats.decimalFormat.slice(0);
    static decimalFormatGeneric:string = PrivatePropFormats.decimalFormatGeneric;
    static moneyFormat: string[] = PrivatePropFormats.moneyFormat.slice(0);
    static moneyFormatGeneric:string = PrivatePropFormats.moneyFormatGeneric;
    static percentFormat: string[] = PrivatePropFormats.percentFormat.slice(0);
    static percentFormatGeneric:string = PrivatePropFormats.decimalFormatGeneric;
    static wholeFormat:string = PrivatePropFormats.wholeFormat;

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForRead(prop:Property, propDef:PropertyDef):string {
        if (prop === null || prop === undefined){
            return '';
        } else {
            return PropFormatter.formatValueForRead(prop.value, propDef);
        }
    }

    static formatValueForRead(value: any, propDef:PropertyDef) {
        if(value === null || value === undefined) {
            return '';
        } else if ((propDef && propDef.isCodeRefType) || value instanceof CodeRef) {
            return (value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || value instanceof ObjectRef) {
            return (value as ObjectRef).description;
        }else if ((propDef && propDef.isDateTimeType)) {
            return (value as Date).toString();
        } else if ((propDef && propDef.isDateType) || value instanceof Date) {
            return (value as Date).toLocaleDateString();
        } else if ((propDef && propDef.isTimeType) || value instanceof TimeValue) {
            const timeValue:TimeValue = value as TimeValue;
            return moment(timeValue).format("LT");
        } else if ((propDef && propDef.isPasswordType)) {
            return (value as string).replace(/./g, "*");
        } else if ((propDef && propDef.isListType) || Array.isArray(value)) {
            return value.reduce((prev, current)=> {
                return ((prev ? prev + ', ' : '') + PropFormatter.formatValueForRead(current, null));
            }, '');
        } else {
            return PropFormatter.toString(value, propDef);
        }
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForWrite(prop:Property, propDef:PropertyDef):string {
        if (prop === null || prop === undefined
            || prop.value === null || prop.value === undefined){
            return null;
        } else if ((propDef && propDef.isCodeRefType) || prop.value instanceof CodeRef) {
            return (prop.value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || prop.value instanceof ObjectRef) {
            return (prop.value as ObjectRef).description;
        } else {
            return PropFormatter.toStringWrite(prop.value, propDef);
        }
    }

    /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value.
     * @param value
     * @param propDef
     * @returns {any}
     */
    static parse(value:any, propDef:PropertyDef) {

        var propValue:any = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        } else if (propDef.isLongType) {
            propValue = Number(value);
        } else if (propDef.isBooleanType) {
            if (typeof value === 'string') {
                propValue = value !== 'false';
            } else {
                propValue = !!value;
            }

        } else if (propDef.isDateType) {
            //this could be a DateValue, a Date, or a string
            if(value instanceof DateValue) {
                propValue = value;
            }else if(typeof value === 'object') {
                propValue = new DateValue(value);
            } else {
                //parse as local time
                propValue = new DateValue(moment(value).toDate());
            }
        } else if (propDef.isDateTimeType) {
            //this could be a DateTimeValue, a Date, or a string
            if(value instanceof DateTimeValue) {
                propValue = value;
            }else if(typeof value === 'object') {
                propValue = new DateTimeValue(value);
            } else {
                //parse as local time
                propValue = new DateTimeValue(moment(value).toDate());
            }
        } else if (propDef.isTimeType) {
            propValue = value instanceof TimeValue ? value : TimeValue.fromString(value);
        } else if (propDef.isObjRefType) {
            propValue = value instanceof ObjectRef ? value : ObjectRef.fromFormattedValue(value);
        } else if (propDef.isCodeRefType) {
            propValue = value instanceof CodeRef ? value : CodeRef.fromFormattedValue(value);
        } else if (propDef.isGeoFixType) {
            propValue = value instanceof GeoFix ? value : GeoFix.fromFormattedValue(value);
        } else if (propDef.isGeoLocationType) {
            propValue = value instanceof GeoLocation ? value : GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    }

    static resetFormats():void {
        PropFormatter.decimalFormat = PrivatePropFormats.decimalFormat.slice(0);
        PropFormatter.decimalFormatGeneric = PrivatePropFormats.decimalFormatGeneric;
        PropFormatter.moneyFormat = PrivatePropFormats.moneyFormat.slice(0);
        PropFormatter.moneyFormatGeneric = PrivatePropFormats.moneyFormatGeneric;
        PropFormatter.percentFormat = PrivatePropFormats.percentFormat.slice(0);
        PropFormatter.percentFormatGeneric = PrivatePropFormats.decimalFormatGeneric;
        PropFormatter.wholeFormat = PrivatePropFormats.wholeFormat;
    }

    static toString(o: any, propDef: PropertyDef): string {
        return PropFormatter.toStringRead(o, propDef);
    }

    /**
     * Render this value as a string
     * @param o
     * @param propDef
     * @returns {any}
     */
    static toStringRead(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number') {
            if (propDef && propDef.semanticType !== "DATA_UNFORMATTED_NUMBER") {
                if (propDef.isMoneyType) {
                    let f = propDef.displayScale < this.moneyFormat.length ? this.moneyFormat[propDef.displayScale] : this.moneyFormatGeneric;
                    // If there is a currency symbol, remove it noting it's position pre/post
                    // Necesary because numeral will replace $ with the symbol based on the locale of the browser.
                    // This may be desired down the road, but for now, the server provides the symbol to use.
                    let atStart:boolean = f.length > 0 && f[0] === '$';
                    let atEnd:boolean = f.length > 0 && f[f.length-1] === '$';
                    if (AppContext.singleton.currencySymbol) {
                        f = f.replace("$", "");               // Format this as a number, and slam in Extender currency symbol
                        var formatted = numeral(o).format(f);
                        if (atStart) formatted = AppContext.singleton.currencySymbol + formatted;
                        if (atEnd) formatted = formatted + AppContext.singleton.currencySymbol;
                    } else {
                        formatted = numeral(o).format(f);  // Should substitute browsers locale currency symbol
                    }
                    return formatted;
                } else if (propDef.isPercentType) {
                    let f = propDef.displayScale < this.percentFormat.length ? this.percentFormat[propDef.displayScale] : this.percentFormatGeneric;
                    return numeral(o).format(f);  // numeral accomplishs * 100, relevant if we use some other symbol
                } else if (propDef.isIntType || propDef.isLongType) {
                    return numeral(o).format(this.wholeFormat);
                } else if (propDef.isDecimalType || propDef.isDoubleType) {
                    let f = propDef.displayScale < this.decimalFormat.length ? this.decimalFormat[propDef.displayScale] : this.decimalFormatGeneric;
                    return numeral(o).format(f);
                }
            } else {
                return String(o);
            }
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toISOString();
            } else if (o instanceof DateValue) {
                return (o as DateValue).dateObj.toISOString();
            } else if (o instanceof DateTimeValue) {
                return (o as DateTimeValue).dateObj.toISOString();
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else if (o instanceof CodeRef) {
                return o.toString();
            } else if (o instanceof ObjectRef) {
                return o.toString();
            } else if (o instanceof GeoFix) {
                return o.toString();
            } else if (o instanceof GeoLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }

    static toStringWrite(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number' && propDef) {
            let s = numeral(100);
            if (propDef.isMoneyType) {
                return o.toFixed(2);
            } else if (propDef.isIntType || propDef.isLongType) {
                return o.toFixed(0);
            } else if (propDef.isDecimalType || propDef.isDoubleType) {
                return o.toFixed(Math.max(2, (o.toString().split('.')[1] || []).length));
            }
        } else {
            return PropFormatter.toStringRead(o, propDef);
        }
    }

}




///////////////////////////////////////////////////////////////////////////////////

// export class FormContext extends PaneContext {
//
//     constructor FormContext(){}
//
// }
//
// /**
//  * Top-level class, representing a Catavolt 'Pane' definition.
//  * All 'Context' classes have a composite {@link PaneDef} that defines the Pane along with a single record
//  * or a list of records.  See {@EntityRecord}
//  * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
//  * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
//  */
// export class PaneContext {
//
//     private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
//     static BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation
//
//     entityRecDef:RecordDef;
//
//     private _binaryCache:{ [index:string]:Array<Binary> }
//     private _lastRefreshTime:Date = new Date(0);
//     private _parentContext:FormContext = null;
//     private _paneRef:number = null;
//
//     /**
//      * Has this 'Pane' been destroyed?
//      */
//     public isDestroyed:boolean;
//
//     /**
//      * Updates a settings object with the new settings from a 'Navigation'
//      * @param initialSettings
//      * @param navRequest
//      * @returns {StringDictionary}
//      */
//     /*
//     static resolveSettingsFromNavRequest(initialSettings:StringDictionary,
//                                          navRequest:NavRequest):StringDictionary {
//
//         var result:StringDictionary = ObjUtil.addAllProps(initialSettings, {});
//         if (navRequest instanceof FormContext) {
//             ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
//             ObjUtil.addAllProps(navRequest.offlineProps, result);
//         } else if (navRequest instanceof NullNavRequest) {
//             ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
//         } else if (navRequest instanceof WebRedirection) {
//             ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
//         }
//         var destroyed = result['fromDialogDestroyed'];
//         if (destroyed) result['destroyed'] = true;
//         return result;
//
//     }*/
//
//     /**
//      *
//      * @param paneRef
//      * @private
//      */
//     constructor(paneRef:number) {
//         this._paneRef = paneRef;
//         this._binaryCache = {};
//     }
//
//     /**
//      * Get the action source for this Pane
//      * @returns {ActionSource}
//      */
//     get actionSource():ActionSource {
//         return this.parentContext ? this.parentContext.actionSource : null;
//     }
//
//     /**
//      * Load a Binary property from a record
//      * @param propName
//      * @param entityRec
//      * @returns {any}
//      */
//     /*
//     binaryAt(propName:string, entityRec:EntityRec):Future<Binary> {
//         const prop:Prop = entityRec.propAtName(propName)
//         if (prop) {
//             if (prop.value instanceof InlineBinaryRef) {
//                 const binRef = prop.value as InlineBinaryRef;
//                 return Future.createSuccessfulFuture('binaryAt', new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
//             } else if (prop.value instanceof ObjectBinaryRef) {
//                 const binRef = prop.value as ObjectBinaryRef;
//                 if (binRef.settings['webURL']) {
//                     return Future.createSuccessfulFuture('binaryAt', new UrlBinary(binRef.settings['webURL']));
//                 } else {
//                     return this.readBinary(propName, entityRec);
//                 }
//             } else if (typeof prop.value === 'string') {
//                 return Future.createSuccessfulFuture('binaryAt', new UrlBinary(prop.value));
//             } else {
//                 return Future.createFailedFuture<Binary>('binaryAt', 'No binary found at ' + propName);
//             }
//         } else {
//             return Future.createFailedFuture<Binary>('binaryAt', 'No binary found at ' + propName);
//         }
//     }*/
//
//     /**
//      * Get the dialog alias
//      * @returns {any}
//      */
//     get dialogAlias():string {
//         return this.dialogRedirection.dialogProperties['dialogAlias'];
//     }
//
//     /**
//      * Get the {@link DialogRedirection} with which this Pane was constructed
//      * @returns {DialogRedirection}
//      */
//     get dialogRedirection():DialogRedirection {
//         return this.paneDef.dialogRedirection;
//     }
//
//     /**
//      * Find a menu def on this Pane with the given actionId
//      * @param actionId
//      * @returns {MenuDef}
//      */
//     findMenuDefAt(actionId:string) {
//         var result:MenuDef = null;
//         if (this.menuDefs) {
//             this.menuDefs.some((md:MenuDef)=> {
//                 result = md.findAtId(actionId);
//                 return result != null;
//             });
//         }
//         return result;
//     }
//
//     /**
//      * Get a string representation of this property suitable for 'reading'
//      * @param propValue
//      * @param propName
//      * @returns {string}
//      */
//     formatForRead(prop:Prop, propName:string):string {
//         return PropFormatter.formatForRead(prop, this.propDefAtName(propName));
//     }
//
//     /**
//      * Get a string representation of this property suitable for 'writing'
//      * @param propValue
//      * @param propName
//      * @returns {string}
//      */
//     formatForWrite(prop:Prop, propName:string):string {
//         return PropFormatter.formatForWrite(prop, this.propDefAtName(propName));
//     }
//
//     /**
//      * Get the underlying form definition {@link FormDef} for this Pane.
//      * If this is not a {@link FormContext} this will be the {@link FormDef} of the owning/parent Form
//      * @returns {FormDef}
//      */
//     get formDef():FormDef {
//         return this.parentContext.formDef;
//     }
//
//     /**
//      * Returns whether or not this pane loaded properly
//      * @returns {boolean}
//      */
//     get hasError():boolean {
//         return this.paneDef instanceof ErrorDef;
//     }
//
//     /**
//      * Return the error associated with this pane, if any
//      * @returns {any}
//      */
//     get error():DialogException {
//         if(this.hasError) {
//             return (this.paneDef as ErrorDef).exception;
//         } else {
//             return null;
//         }
//     }
//
//     /**
//      * Returns whether or not the data in this pane is out of date
//      * @returns {boolean}
//      */
//     get isRefreshNeeded():boolean {
//         return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
//     }
//
//     /**
//      * Get the last time this pane's data was refreshed
//      * @returns {Date}
//      */
//     get lastRefreshTime():Date {
//         return this._lastRefreshTime;
//     }
//
//     /**
//      * @param time
//      */
//     set lastRefreshTime(time:Date) {
//         this._lastRefreshTime = time;
//     }
//
//     /**
//      * Get the all {@link MenuDef}'s associated with this Pane
//      * @returns {Array<MenuDef>}
//      */
//     get menuDefs():Array<MenuDef> {
//         return this.paneDef.menuDefs;
//     }
//
//     /**
//      * @private
//      * @returns {FormContext|boolean}
//      */
//     get offlineCapable():boolean {
//         return this._parentContext && this._parentContext.offlineCapable;
//     }
//
//     /**
//      * Get the underlying @{link PaneDef} associated with this Context
//      * @returns {PaneDef}
//      */
//     get paneDef():PaneDef {
//         if (this.paneRef == null) {
//             return this.formDef.headerDef;
//         } else {
//             return this.formDef.childrenDefs[this.paneRef];
//         }
//     }
//
//     /**
//      * Get the numeric value, representing this Pane's place in the parent {@link FormContext}'s list of child panes.
//      * See {@link FormContext.childrenContexts}
//      * @returns {number}
//      */
//     get paneRef():number {
//         return this._paneRef;
//     }
//
//     set paneRef(paneRef:number) {
//         this._paneRef = paneRef;
//     }
//
//     /**
//      * Get the title of this Pane
//      * @returns {string}
//      */
//     get paneTitle():string {
//         return this.paneDef.findTitle();
//     }
//
//     /**
//      * Get the parent {@link FormContext}
//      * @returns {FormContext}
//      */
//     get parentContext():FormContext {
//         return this._parentContext;
//     }
//
//     set parentContext(parentContext:FormContext) {
//         this._parentContext = parentContext;
//         this.initialize();
//     }
//
//     /**
//      * Parses a value to prepare for 'writing' back to the server
//      * @param formattedValue
//      * @param propName
//      * @returns {any}
//      */
//     parseValue(formattedValue:any, propName:string):any {
//         return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
//     }
//
//     /**
//      * Get the propery definition for a property name
//      * @param propName
//      * @returns {PropDef}
//      */
//     propDefAtName(propName:string):PropDef {
//         return this.entityRecDef.propDefAtName(propName);
//     }
//
//     /**
//      * Read all the Binary values in this {@link EntityRec}
//      * @param entityRec
//      * @returns {Future<Array<Try<Binary>>>}
//      */
//     readBinaries(entityRec:EntityRec):Future<Array<Try<Binary>>> {
//         return Future.sequence<Binary>(
//             this.entityRecDef.propDefs.filter((propDef:PropDef)=> {
//                 return propDef.isBinaryType
//             }).map((propDef:PropDef)=> {
//                 return this.readBinary(propDef.name, entityRec);
//             })
//         );
//     }
//
//     /**
//      * Get the session information
//      * @returns {SessionContext}
//      */
//     get sessionContext():SessionContext {
//         return this.parentContext.sessionContext;
//     }
//
//     writeAttachment(attachment:Attachment):Future<void> {
//         return DialogService.addAttachment(this.dialogRedirection.dialogHandle, attachment, this.sessionContext);
//     }
//
//     writeAttachments(entityRec:EntityRec):Future<Array<Try<void>>> {
//         return Future.sequence<void>(
//             entityRec.props.filter((prop:Prop)=> {
//                 return prop.value instanceof Attachment;
//             }).map((prop:Prop) => {
//                 const attachment:Attachment = prop.value as Attachment;
//                 return this.writeAttachment(attachment);
//             })
//         );
//     }
//
//     /**
//      * Get the all {@link ViewDesc}'s associated with this Pane
//      * @returns {Array<ViewDesc>}
//      */
//     get viewDescs():Array<ViewDesc> {
//         return this.paneDef.viewDescs;
//     }
//
//     /**
//      * Write all Binary values in this {@link EntityRecord} back to the server
//      * @param entityRec
//      * @returns {Future<Array<Try<XWritePropertyResult>>>}
//      */
//     writeBinaries(entityRec:EntityRec):Future<Array<Try<XWritePropertyResult>>> {
//         return Future.sequence<XWritePropertyResult>(
//             entityRec.props.filter((prop:Prop)=> {
//                 return this.propDefAtName(prop.name).isBinaryType;
//             }).map((prop:Prop) => {
//                 let writeFuture: Future<XWritePropertyResult> = Future.createSuccessfulFuture<XWritePropertyResult>('startSeq', {} as XWritePropertyResult);
//                 if (prop.value) {
//                     let ptr: number = 0;
//                     const encBin: EncodedBinary = prop.value as EncodedBinary;
//                     const data = encBin.data;
//                     while (ptr < data.length) {
//                         const boundPtr = (ptr: number) => {
//                             writeFuture = writeFuture.bind((prevResult)=> {
//                                 const encSegment: string = (ptr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substr(ptr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(ptr);
//                                 return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.sessionContext);
//                             });
//                         }
//                         boundPtr(ptr);
//                         ptr += PaneContext.CHAR_CHUNK_SIZE;
//                     }
//                 } else {
//                     // This is a delete
//                     writeFuture = writeFuture.bind((prevResult)=> {
//                         return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, null, false, this.sessionContext);
//                     });
//                 }
//                 return writeFuture;
//             })
//         );
//     }
//
//     //protected
//
//     //abstract
//
//     getSelectedViewId():Future<ViewId> { return null; }
//
//     openView(targetViewDesc:ViewDesc): Future<Either<PaneContext, NavRequest>>{ return null; }
//
//     protected initialize() {}
//
//     protected readBinary(propName:string, entityRec:EntityRec):Future<Binary> { return null; }
//
// }

