/**
 * Created by rburson on 8/29/17.
 */

import {Client, ClientMode, JsonClientResponse} from "./client";
import {ArrayUtil, DataUrl, DateTimeValue, DateValue, Log, ObjUtil, StringDictionary, TimeValue} from "./util";
import {
    ClientType, Dialog, DialogMessage, DialogRedirection, Login, Menu, PropertyDef, Property, Redirection,
    Session, Tenant, WebRedirection, Workbench, WorkbenchAction, WorkbenchRedirection, CodeRef, ObjectRef,
    MapLocation, GpsReading, MapLocationProperty, GpsReadingProperty, NavRequest, NullNavRequest, RecordDef,
    DialogMode, View, ViewMode, Form, ErrorMessage, DialogException, ViewDescriptor, Record, EntityBuffer, NullEntityRec,
    EntityRec, AttributeCellValue, Column, Details, List, Map, TypeNames, ModelUtil, QueryDirection,
    QueryDialog, EditorDialog, Filter, Sort, ReferringObject, Graph, Calendar, PrintMarkup, BarcodeScan, ImagePicker,
    RedirectionUtil, DialogType, NullRedirection, ActionParameters, RecordSet, QueryParameters, QueryDirectionEnum,
    InlineBinaryRef, ObjectBinaryRef, ViewModeEnum, DialogModeEnum, ReferringDialog
} from "./models";
import {FetchClient} from "./ws";
import {PersistentClient} from "./persistence";
import * as moment from 'moment';
// Chose the locales to load based on this list:
// https://stackoverflow.com/questions/9711066/most-common-locales-for-worldwide-compatibility
// Best effort for now.  Need to dynamically load these from Globalize???
import 'moment/locale/zh-cn';
import 'moment/locale/ru';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/en-gb';
import 'moment/locale/de';
import 'moment/locale/pt';
import 'moment/locale/pt-br';
import 'moment/locale/en-ca';
import 'moment/locale/it';
import 'moment/locale/ja';
import * as numeral from "numeral";
import {PrintForm} from "./print";

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
    private _clientMode:ClientMode = ClientMode.ONLINE;
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
            AppContext._singleton = new AppContext(AppContext.SERVER_URL, AppContext.SERVER_VERSION);
        }
        return AppContext._singleton;
    }

    /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    private constructor(serverUrl:string, serverVersion:string) {

        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._devicePropsStatic = {};
        this._devicePropsDynamic = {};

        this.initPersistentApi(serverUrl, serverVersion);

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
    initDialogApi(serverUrl:string, serverVersion:string=AppContext.SERVER_VERSION):void {

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

    /**
     * Open a redirection
     *
     * @param redirection
     * @param actionSource
     * @returns {Promise<NavRequest>}
     */
    openRedirection(redirection:Redirection):Promise<NavRequest> {

        if(redirection.type === TypeNames.DialogRedirectionTypeName) {
            return this.openDialog(redirection as DialogRedirection);
        } else if(redirection.type === TypeNames.WebRedirectionTypeName) {
            return Promise.resolve(<WebRedirection>redirection);
        } else if(redirection.type === TypeNames.WorkbenchRedirectionTypeName) {
            return this.getWorkbench((<WorkbenchRedirection>redirection).workbenchId);
        } else if (redirection.type === TypeNames.NullRedirectionTypeName) {
           return Promise.resolve(new NullNavRequest(redirection.referringObject));
        } else {
            return Promise.reject(new Error(`Unrecognized type of Redirection ${ObjUtil.formatRecAttr(redirection)}`));
        }

    }

    openDialog(redirection:DialogRedirection):Promise<NavRequest> {

        return this.dialogApi.getDialog(this.session.tenantId, this.session.id, redirection.dialogId)
            .then((dialog:Dialog)=>{
                if(dialog.view instanceof Form) {
                    return new FormContext(dialog, <DialogRedirection>redirection, null, null, this.session, this);
                } else {
                    throw new Error(`Unexpected top-level dialog view type: ${dialog.view.type}`);
                }
            });
    }

    getRedirection(redirectionId:string):Promise<Redirection> {

        return this.dialogApi.getRedirection(this.session.tenantId, this.session.id, redirectionId);

    }

    /**
     * Open a {@link WorkbenchLaunchAction}
     * @param launchAction
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performLaunchAction(launchAction:WorkbenchAction):Promise<{actionId:string} | Redirection> {

        return this.performLaunchActionForId(launchAction.workbenchId, launchAction.workbenchId);

    }

    performNavigation(launchAction:WorkbenchAction):Promise<NavRequest> {

        return this.performNavigationForId(launchAction.workbenchId, launchAction.actionId);

    }

    performNavigationForId(workbenchId:string, launchActionId:string):Promise<NavRequest> {

        return this.performLaunchActionForId(workbenchId, launchActionId).then((result:{actionId:string} | Redirection)=>{
          if(RedirectionUtil.isRedirection(result)) {
            return this.openRedirection(result as Redirection);
          } else {
              return new NullNavRequest();
          }
        });
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
        this.initPersistentApi(AppContext.SERVER_URL, AppContext.SERVER_VERSION);
    }

    setOnlineClient():void {
        this.initDialogApi(AppContext.SERVER_URL, AppContext.SERVER_VERSION);
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

/////////////////Begin Dialog Context Classes //////////////////////////////////////////////////////////

/**
 * Top-level class, representing a Catavolt 'Pane' definition.
 * All 'Context' classes have a composite {@link PaneDef} that defines the Pane along with a single record
 * or a list of records.  See {@EntityRecord}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export abstract class PaneContext implements Dialog {

    //statics
    static BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation

    //private/protected
    private _binaryCache:{ [index:string]:Array<Binary> } = {};
    private _childrenContexts:Array<PaneContext>;
    private _dialog:Dialog;
    private _dialogRedirection:DialogRedirection;
    private _lastRefreshTime:Date = new Date(0);

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                readonly paneRef:number,
                readonly parentContext:PaneContext,
                readonly session:Session,
                readonly appContext:AppContext
    ) {
        this.initialize(dialog, dialogRedirection);
    }
    /** Dialog Impl */

    get availableViews():Array<ViewDescriptor>{
       return this.dialog.availableViews;
    }
    get businessClassName():string{
       return this.dialog.businessClassName;
    }
    get description():string{
        return this.dialog.description;
    }
    get dialogClassName():string{
        return this.dialog.dialogClassName;
    }
    get dialogMode():DialogMode{
        return this.dialog.dialogMode;
    }
    get header():View{
        return this.dialog.header;
    }
    get id():string{
        return this.dialog.id;
    }
    get recordDef(): RecordDef{
        return this.dialog.recordDef;
    }
    get referringObject():ReferringObject {
        return this.dialog.referringObject;
    }
    get selectedViewId():string{
        return this.dialog.selectedViewId;
    }
    get sessionId():string{
        return this.dialog.sessionId;
    }
    get tenantId(): string{
        return this.dialog.tenantId;
    }
    get type():DialogType {
       return this.dialog.type;
    }
    get view():View{
        return this.dialog.view;
    }
    get viewMode():ViewMode{
        return this.dialog.viewMode;
    }


    /* public methods */

    /**
     * Load a Binary property from a record
     * @param propName
     * @param entityRec
     * @returns {any}
     */
     binaryAt(propName:string, entityRec:EntityRec):Promise<Binary> {

         const prop: Property = entityRec.propAtName(propName)
         if (prop) {
             if (prop.value instanceof InlineBinaryRef) {
                 const binRef = prop.value as InlineBinaryRef;
                 return Promise.resolve(new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
             } else if (prop.value instanceof ObjectBinaryRef) {
                 const binRef = prop.value as ObjectBinaryRef;
                 if (binRef.settings['webURL']) {
                     return Promise.resolve(new UrlBinary(binRef.settings['webURL']));
                 } else {
                     return this.readBinary(propName, entityRec);
                 }
             } else if (typeof prop.value === 'string') {
                 return Promise.resolve(new UrlBinary(prop.value));
             } else if (prop.value instanceof EncodedBinary) {
                 return Promise.resolve(prop.value);

             } else {
                 return Promise.reject('No binary found at ' + propName);
             }
         } else {
             return Promise.reject('No binary found at ' + propName);
         }
     }

     //to comply with Dialog interface
     get children():Array<Dialog> {
         return this.childrenContexts;
     }

     get childrenContexts():Array<PaneContext> {
        return this._childrenContexts;
     }

     destroy(){
         //@TODO
         //destroy this dialog
     }

     get dialog():Dialog {
        return this._dialog;
     }

    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    /**
     * Return the error associated with this pane, if any
     * @returns {any}
     */
    get error():DialogException {
        if(this.hasError) {
            return (this.view as ErrorMessage).exception;
        } else {
            return null;
        }
    }


    /**
     * Find a menu def on this Pane with the given actionId
     * @param actionId
     * @returns {Menu}
     */
    findMenuAt(actionId:string) {
        return this.view.findMenuAt(actionId);
    }

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForRead(prop:Property, propName:string):string {
        return PropFormatter.formatForRead(prop, this.propDefAtName(propName));
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForWrite(prop:Property, propName:string):string {
        return PropFormatter.formatForWrite(prop, this.propDefAtName(propName));
    }

    /**
     * Get the underlying form definition {@link FormDef} for this Pane.
     * If this is not a {@link FormContext} this will be the {@link FormDef} of the owning/parent Form
     * @returns {FormDef}
     */
    get form():Form {
        return this.parentContext.form;
    }

    /**
     * Returns whether or not this pane loaded properly
     * @returns {boolean}
     */
    get hasError():boolean {
        return this.view instanceof ErrorMessage;
    }

    /**
     * Returns whether or not this Form is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this.dialogMode === DialogModeEnum.DESTROYED || this.isAnyChildDestroyed;
    }

    /**
     * Returns whether or not the data in this pane is out of date
     * @returns {boolean}
     */
    get isRefreshNeeded():boolean {
        return this._lastRefreshTime.getTime() < this.appContext.lastMaintenanceTime.getTime();
    }

    /**
     * Get the last time this pane's data was refreshed
     * @returns {Date}
     */
    get lastRefreshTime():Date {
        return this._lastRefreshTime;
    }

    /**
     * @param time
     */
    set lastRefreshTime(time:Date) {
        this._lastRefreshTime = time;
    }

    /**
     * Get the all {@link Menu}'s associated with this Pane
     * @returns {Array<Menu>}
     */
    get menu():Menu {
        return this.view.menu;
    }

    openView(targetViewDescriptor:ViewDescriptor): Promise<PaneContext>{

        return this.appContext.dialogApi.changeView(this.tenantId, this.sessionId, this.dialog.id, targetViewDescriptor.id)
            .then((dialog:Dialog)=>{
                this.initialize(dialog, this.dialogRedirection);
                return this;
            });

    };


    /**
     * Get the title of this Pane
     * @returns {string}
     */
    get paneTitle():string {
        let title = this.view.findTitle();
        if (!title) title = this.description;
        return title;
    }

    /**
     * Parses a value to prepare for 'writing' back to the server
     * @param formattedValue
     * @param propName
     * @returns {any}
     */
    parseValue(formattedValue:any, propName:string):any {
        return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    }

    /**
     * Get the propery definition for a property name
     * @param propName
     * @returns {PropDef}
     */
    propDefAtName(propName:string):PropertyDef {
        return this.recordDef.propDefAtName(propName);
    }


    /**
     * Read all the Binary values in this {@link EntityRec}
     * @param entityRec
     * @returns {Future<Array<Try<Binary>>>}
     */
    readBinaries(record:Record):Promise<Array<Binary>> {
        return Promise.all(
            this.recordDef.propertyDefs.filter((propDef: PropertyDef) => {
                return propDef.isBinaryType
            }).map((propDef: PropertyDef) => {
                return this.readBinary(propDef.propertyName, record);
            })
        );
    }

    /**
     * Get the all {@link ViewDescriptor}'s associated with this Form
     * @returns {Array<ViewDescriptor>}
     */
    get viewDescs():Array<ViewDescriptor> {
        return this.dialog.availableViews;
    }

    /* @TODO */
     writeAttachment(attachment:Attachment):Promise<void> {
         /*
        return DialogService.addAttachment(this.dialogRedirection.dialogHandle, attachment, this.session);
        */
         return Promise.resolve(null);
     }

     writeAttachments(entityRec:EntityRec):Promise<Array<void>> {

         return Promise.all(
             entityRec.properties.filter((prop: Property) => {
                 return prop.value instanceof Attachment;
             }).map((prop: Property) => {
                 const attachment: Attachment = prop.value as Attachment;
                 return this.writeAttachment(attachment);
             })
         );

     }


    /**
     * Write all Binary values in this {@link EntityRecord} back to the server
     * @param entityRec
     * @returns {Future<Array<Try<XWritePropertyResult>>>}
     */
    /* @TODO */
     writeBinaries(entityRec:EntityRec):Promise<Array<void>> {
         /*return Promise.all(
             entityRec.properties.filter((prop: Property) => {
                 return this.propDefAtName(prop.name).isBinaryType;
             }).map((prop: Property) => {
                 let writePromise:Promise<XWritePropertyResult> = Promise.resolve({} as XWritePropertyResult);
                 if (prop.value) {
                     let ptr: number = 0;
                     const encBin: EncodedBinary = prop.value as EncodedBinary;
                     const data = encBin.data;
                     while (ptr < data.length) {
                         const boundPtr = (ptr: number) => {
                             writePromise = writePromise.then((prevResult) => {
                                 const encSegment: string = (ptr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substr(ptr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(ptr);
                                 return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.session);
                             });
                         }
                         boundPtr(ptr);
                         ptr += PaneContext.CHAR_CHUNK_SIZE;
                     }
                 } else {
                     // This is a delete
                     writePromise = writePromise.then((prevResult) => {
                         return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, null, false, this.sessionContext);
                     });
                 }
                 return writePromise;
             })
         );*/

         return Promise.resolve(null);
     }


    protected initialize(dialog:Dialog, dialogRedirection:DialogRedirection) {

        this._dialog = dialog;
        this._dialogRedirection = dialogRedirection;
        this._childrenContexts = this.createChildContexts(dialog.children, dialogRedirection);

    }

    /**
     * Perform this action associated with the given Menu on this Pane.
     * The targets array is expected to be an array of object ids.
     * @param menu
     * @param targets
     * @returns {Future<NavRequest>}
     */
    protected invokeMenuAction(menu:Menu, actionParams:ActionParameters):Promise<{actionId:string} | Redirection> {

        return this.appContext.dialogApi.performAction(this.session.tenantId, this.session.id,
            this.dialog.id, menu.actionId, actionParams).then((result:{actionId:string} | Redirection)=>{
            if(RedirectionUtil.isRedirection(result)) {
                this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);
            }
            //@TODO
            //lastMaintenanceTime really should not be set here (i.e. we don't know if changes were actually made)
            //use 'isLocalRefreshNeeded' instead of this - needs to be added to the Dialog API
            //this.appContext.lastMaintenanceTime = new Date();
            return result;
        });
    }

    protected invokeNavigation(menu:Menu, actionParams:ActionParameters):Promise<NavRequest> {

        return this.invokeMenuAction(menu, actionParams).then((result:{actionId:string} | Redirection)=>{
            if(RedirectionUtil.isRedirection(result)) {
                return this.appContext.openRedirection(result as Redirection);
            } else {
                return new NullNavRequest();
            }
        });
    }


    //@TODO
    protected readBinary(propName:string, record:Record):Promise<Binary> {

        /*
        let seq: number = 0;
        let encodedResult: string = '';
        let inProgress: string = '';
        let f: (XReadPropertyResult) => Promise<Binary> = (result: XReadPropertyResult) => {
            if (result.hasMore) {
                inProgress += atob(result.data);  // If data is in multiple loads, it must be decoded/built/encoded
                return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                if (inProgress) {
                    inProgress += atob(result.data);
                    encodedResult = btoa(inProgress);
                } else {
                    encodedResult = result.data;
                }
                return Promise.resolve<Binary>(new EncodedBinary(encodedResult));
            }
        }
        return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            */
        return Promise.resolve(null);
    };


    protected updateSettingsWithNewDialogProperties(referringObject:ReferringObject) {

        if(referringObject.isDialogReferrer()) {
            //@TODO - remove this once all DialogModes come back from server as uppercase
            this.dialog.dialogMode = (referringObject as ReferringDialog).dialogMode.toUpperCase() as DialogMode;
        }

    }

    /*
        Private Methods
     */

    private createChildContexts(children:Array<Dialog>, dialogRedirection:DialogRedirection):Array<PaneContext> {

        return children ? children.map((dialog:Dialog, n:number)=>{ return this.createChildContext(dialog, dialogRedirection, n)}) : [];
    }

    private createChildContext(dialog:Dialog, dialogRedirection:DialogRedirection, paneRef:number):PaneContext {

        if (dialog.view instanceof List) {
            return new ListContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if (dialog.view instanceof Details) {
            return new DetailsContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if (dialog.view instanceof Map) {
            return new MapContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if (dialog.view instanceof Form) {
            return new FormContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof Graph) {
           return new GraphContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof PrintMarkup) {
            return new PrintMarkupContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof Calendar) {
            return new CalendarContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof GpsReading) {
            return new GpsReadingContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof MapLocation) {
            return new MapLocationContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof BarcodeScan) {
            return new BarcodeScanContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        } else if(dialog.view instanceof ImagePicker) {
            return new ImagePickerContext(dialog, dialogRedirection, paneRef, this, this.session, this.appContext);
        }
    }


    /**
     * @private
     * @returns {boolean}
     */
    private get isAnyChildDestroyed():boolean {
        return this.childrenContexts.some((paneContext:PaneContext)=> {
            return paneContext.isDestroyed;
        });
    }

}

/**
 * PaneContext Subtype that represents a Catavolt Form Definition
 * A form is a 'container' composed of child panes of various concrete types.
 * A FormContext parallels this design, and contains a list of 'child' contexts
 * See also {@link FormDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class FormContext extends PaneContext implements Dialog, NavRequest {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                sessionContext:Session,
                appContext:AppContext
    ) {
        super(dialog, dialogRedirection, paneRef,
            parentContext, sessionContext, appContext);
    }

    /**
     * Close this form
     * @returns {Future<VoidResult>}
     */
    /* @TODO */
     close():Promise<VoidResult> {
         /*
        return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
        */
         return Promise.resolve(null);
     }

     destroy():void{}

    /**
     * Get the underlying Form definition for this FormContext
     * @returns {FormDef}
     */
    get form():Form {
        return this.view as Form;
    }

    /**
     * Perform the action associated with the given Menu on this Form
     * @param menu
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menu: Menu): Promise<{actionId:string} | Redirection> {

        return this.invokeMenuAction(menu, {type:TypeNames.ActionParametersTypeName}).then(result=>{
            return result;
        });

    }

    performNavigation(menu: Menu): Promise<NavRequest> {

        return this.performMenuAction(menu).then((result:{actionId:string} | Redirection)=>{
            if(RedirectionUtil.isRedirection(result)) {
                return this.appContext.openRedirection(result as Redirection);
            } else {
                return new NullNavRequest();
            }
        });
    }

    protected initialize(dialog:Dialog, dialogRedirection:DialogRedirection) {
        super.initialize(dialog, dialogRedirection);
    }
}

/**
 * PanContext Subtype that represents an 'Editor Pane'.
 * An 'Editor' represents and is backed by a single Record and Record definition.
 * See {@link EntityRec} and {@link RecordDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class EditorContext extends PaneContext {

    private _buffer:EntityBuffer;
    private _isFirstReadComplete:boolean;

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext
    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    /**
     * Get the current buffered record
     * @returns {EntityBuffer}
     */
    get buffer():EntityBuffer {
        if (!this._buffer) {
            this._buffer = new EntityBuffer(NullEntityRec.singleton);
        }
        return this._buffer;
    }

    changeViewMode(viewMode:ViewMode):Promise<RecordDef> {

        return this.appContext.dialogApi.changeMode(this.tenantId, this.sessionId, this.dialog.id, viewMode)
            .then((dialog:EditorDialog)=>{
                this.initialize(dialog, this.dialogRedirection);
                return this.dialog.recordDef;
            });
    }

    /**
     * Get the associated entity record
     * @returns {EntityRec}
     */
    get entityRec():EntityRec {
        return this._buffer.toEntityRec();
    }

    /**
     * Get the current version of the entity record, with any pending changes present
     * @returns {EntityRec}
     */
    get entityRecNow():EntityRec {
        return this.entityRec;
    }

    /**
     * Get the possible values for a 'constrained value' property
     * @param propName
     * @returns {Future<Array<any>>}
     */
    //@TODO
    getAvailableValues(propName:string):Promise<Array<Object>> {
        /*
         return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName,
         this.buffer.afterEffects(), this.sessionContext).map((valuesResult:XGetAvailableValuesResult)=> {
         return valuesResult.list;
         });
         */
        return Promise.resolve(null);

    }

    /**
     * Returns whether or not this cell definition contains a binary value
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isBinary(cellValue:AttributeCellValue):boolean {
        var propDef = this.propDefAtName(cellValue.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValue.isInlineMediaStyle));
    }

    /**
     * Returns whether or not this Editor Pane is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this.dialogMode === DialogModeEnum.DESTROYED;
    }

    /**
     * Returns whether or not the buffers contain valid data via a successful read operation.
     * @returns {boolean}
     */
    get isFirstReadComplete():boolean {
        return this._isFirstReadComplete;
    }

    /**
     * Returns whether or not this Editor is in 'read' mode
     * @returns {boolean}
     */
    get isReadMode():boolean {
        return this.viewMode === ViewModeEnum.READ;
    }

    /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */
    isReadModeFor(propName:string):boolean {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.writeAllowed || !propDef.writeEnabled;
        }
        return true;
    }

    /**
     * Returns whether or not this cell definition contains a binary value that should be treated as a signature control
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isSignature(cellValueDef:AttributeCellValue):boolean {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return this.isBinary(cellValueDef) && propDef.isSignatureType;
    }

    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    get isWriteMode():boolean {
        return this.viewMode === ViewModeEnum.WRITE;
    }

    /**
     * Perform the action associated with the given Menu on this EditorPane.
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param menu
     * @param pendingWrites
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menu:Menu, pendingWrites:EntityRec):Promise<{actionId:string} | Redirection> {

        return this.invokeMenuAction(menu, {pendingWrites:pendingWrites, type:TypeNames.ActionParametersTypeName}).then(result=>{
            return result;
        });
    }

    performNavigation(menu:Menu, pendingWrites:EntityRec):Promise<NavRequest> {

            return this.performMenuAction(menu, pendingWrites).then((result:{actionId:string} | Redirection)=>{
                if(RedirectionUtil.isRedirection(result)) {
                    return this.appContext.openRedirection(result as Redirection);
                } else {
                    return new NullNavRequest();
                }
            });
    }

    /**
     * Properties whose {@link PropDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorContext.getAvailableValues}.  When a value is seleted, other properties
     * available values may change. (i.e. Country, State, City dropdowns)
     * @param propertyName
     * @param value
     * @returns {Future<null>}
     */
    //@TODO
    processSideEffects(propertyName:string, value:any):Promise<void> {

        /*
         var sideEffectsFr:Future<EntityRec> = DialogService.processSideEffects(this.paneDef.dialogHandle,
         this.sessionContext, propertyName, value, this.buffer.afterEffects()).map((changeResult:XPropertyChangeResult)=> {
         return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new NullEntityRec();
         });

         return sideEffectsFr.map((sideEffectsRec:EntityRec)=> {
         var originalProps = this.buffer.before.props;
         var userEffects = this.buffer.afterEffects().props;
         var sideEffects = sideEffectsRec.props;
         sideEffects = sideEffects.filter((prop:Prop)=> {
         return prop.name !== propertyName;
         });
         this._buffer = EntityBuffer.createEntityBuffer(this.buffer.objectId,
         EntityRecUtil.union(originalProps, sideEffects),
         EntityRecUtil.union(originalProps, EntityRecUtil.union(userEffects, sideEffects)));
         return null;
         });
         */
        return Promise.resolve(null);
    }

    /**
     * Read (load) the {@link EntityRec} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<EntityRec>}
     */
    read():Promise<EntityRec> {

        return this.appContext.dialogApi.getRecord(this.tenantId, this.sessionId, this.dialog.id)
            .then((record:EntityRec)=>{
                this._isFirstReadComplete = true;
                this.initBuffer(record);
                this.lastRefreshTime = new Date();
                return record;
            });
    }


    /**
     * Set the value of a property in this {@link EntityRecord}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */
    setPropValue(name:string, value:any):any {
        const propDef:PropertyDef = this.propDefAtName(name);
        let parsedValue:any = null;
        if (propDef) {
            parsedValue = (value !== null && value !== undefined) ? this.parseValue(value, propDef.propertyName) : null;
            this.buffer.setValue(propDef.propertyName, parsedValue);
        }
        return parsedValue;
    }

    /**
     * Set a binary property from a string formatted as a 'data url'
     * See {@link https://en.wikipedia.org/wiki/Data_URI_scheme}
     * @param name
     * @param dataUrl
     */
    setBinaryPropWithDataUrl(name:string, dataUrl:string) {
        if (dataUrl) {
            const urlObj: DataUrl = new DataUrl(dataUrl);
            this.setBinaryPropWithEncodedData(name, urlObj.data, urlObj.mimeType);
        } else {
            this.setPropValue(name, null);  // Property is being deleted/cleared
        }
    }

    /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */
    setBinaryPropWithEncodedData(name:string, encodedData:string, mimeType:string) {
        const propDef:PropertyDef = this.propDefAtName(name);
        if (propDef) {
            const value = new EncodedBinary(encodedData, mimeType);
            this.buffer.setValue(propDef.propertyName, value);
        }
    }

    /**
     * Write this record (i.e. {@link EntityRec}} back to the server
     * @returns {Future<Either<NavRequest, EntityRec>>}
     */
    write():Promise<EntityRec | Redirection> {

        let deltaRec: EntityRec = this.buffer.afterEffects();

        /* Write the 'special' props first */
        return this.writeBinaries(deltaRec).then((binResult:Array<void>) => {
            return this.writeAttachments(deltaRec).then((atResult:Array<void>) => {
                /* Remove special property types before writing the actual record */
                deltaRec = this.removeSpecialProps(deltaRec);
                return this.appContext.dialogApi.putRecord(this.tenantId, this.sessionId, this.dialog.id, deltaRec).then(result=>{
                    const now = new Date();
                    this.appContext.lastMaintenanceTime = now;
                    this.lastRefreshTime = now;
                    if(RedirectionUtil.isRedirection(result)) {
                        this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);
                        return result as EntityRec | Redirection;
                    } else {
                        //we need to refresh the dialog in case of changes
                        return this.appContext.dialogApi.getDialog(this.tenantId, this.sessionId, this.dialog.id)
                            .then((dialog:Dialog)=>{
                                this.initialize(this.dialog, this.dialogRedirection);
                                this.initBuffer(result as EntityRec);
                                return result as EntityRec | Redirection;
                            });
                    }
                });
            });
        });

    }

    writeAndNavigate():Promise<NavRequest | EntityRec> {
        return this.write().then((result: Record | Redirection) => {
            if (RedirectionUtil.isRedirection(result)) {
                return this.appContext.openRedirection(result as Redirection) as Promise<NavRequest | EntityRec>;
            } else {
                return result as NavRequest | EntityRec;
            }
        });
    }

    //Module level methods

    /**
     * @private
     */
    initialize(dialog:Dialog, dialogRedirection:DialogRedirection) {
        super.initialize(dialog, dialogRedirection);
        this._buffer = null;
    }

    //Private methods

    /*
        @TODO
        Consider clone and deep copy here, to avoid potential ui side-effects
     */
    private removeSpecialProps(entityRec:EntityRec):EntityRec {
        entityRec.properties = entityRec.properties.filter((prop:Property)=>{
            /* Remove the Binary(s) as they have been written seperately */
            return !this.propDefAtName(prop.name).isBinaryType;
        }).map((prop:Property)=>{
            /*
             Remove the Attachment(s) (as they have been written seperately) but replace
             the property value with the file name of the attachment prior to writing
             */
            if(prop.value instanceof Attachment) {
                const attachment = prop.value as Attachment;
                return new Property(prop.name, attachment.name, prop.propertyType, prop.format, prop.annotations);
            } else {
                return prop;
            }
        });
        return entityRec;
    }

    private initBuffer(entityRec:EntityRec) {
        this._buffer = entityRec ? new EntityBuffer(entityRec) : new EntityBuffer(NullEntityRec.singleton);
    }

}


/**
 * PaneContext Subtype that represents a 'Query Pane'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class QueryContext extends PaneContext {

    private _scroller: QueryScroller;
    private _defaultActionId: string;

    constructor(dialog: Dialog,
                dialogRedirection: DialogRedirection,
                paneRef: number,
                parentContext: PaneContext,
                session: Session,
                appContext: AppContext) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    /**
     * Returns whether or not a column is of a binary type
     * @param columnDef
     * @returns {PropDef|boolean}
     */
    isBinary(column: Column): boolean {
        var propDef = this.propDefAtName(column.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && propDef.isInlineMediaStyle));
    }

    get defaultActionId(): string {
        return this._defaultActionId;
    }

    /**
     * Perform this action associated with the given Menu on this Pane.
     * The targets array is expected to be an array of object ids.
     * @param menu
     * @param targets
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menu: Menu, targets: Array<string>): Promise<{ actionId: string } | Redirection> {

        return this.invokeMenuAction(menu, {
            targets: targets,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });

    }

    performNavigation(menu: Menu, targets: Array<string>): Promise<NavRequest> {

        return this.performMenuAction(menu, targets).then((result: { actionId: string } | Redirection) => {
            if (RedirectionUtil.isRedirection(result)) {
                return this.appContext.openRedirection(result as Redirection);
            } else {
                return new NullNavRequest();
            }
        });
    }

    /**
     * Perform a query
     * Note: {@link QueryScroller} is the preferred way to perform a query.
     * see {@link QueryContext.newScroller} and {@link QueryContext.setScroller}
     * @param maxRows
     * @param direction
     * @param fromObjectId
     * @returns {Future<RecordSet>}
     */
    query(maxRows: number, direction: QueryDirection, fromObjectId: string): Promise<RecordSet> {

        const queryParams: QueryParameters = fromObjectId ?
            {
                fetchDirection: direction,
                fetchMaxRecords: maxRows,
                fromBusinessId: fromObjectId,
                type: TypeNames.QueryParametersTypeName
            } :
            {fetchDirection: direction, fetchMaxRecords: maxRows, type: TypeNames.QueryParametersTypeName};

        return this.appContext.dialogApi.getRecords(this.session.tenantId, this.session.id, this.dialog.id, queryParams)
            .then((recordSet: RecordSet) => {
                this.lastRefreshTime = new Date();
                this._defaultActionId = recordSet.defaultActionId;
                return recordSet;
            });

    }

    /**
     * Clear the QueryScroller's buffer and perform this query
     * @returns {Future<Array<EntityRec>>}
     */
    refresh(): Promise<Array<EntityRec>> {
        return this._scroller.refresh();
    }

    /**
     * Get the associated QueryScroller
     * @returns {QueryScroller}
     */
    get scroller(): QueryScroller {
        if (!this._scroller) {
            this._scroller = this.newScroller();
        }
        return this._scroller;
    }

    /**
     * Creates a new QueryScroller with the given values
     * @param pageSize
     * @param firstObjectId
     * @param markerOptions
     * @returns {QueryScroller}
     */
    setScroller(pageSize: number, firstObjectId: string, markerOptions: Array<QueryMarkerOption>) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    }

    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    newScroller(): QueryScroller {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    }

    //protected

    protected initialize(dialog: Dialog, dialogRedirection: DialogRedirection) {
        super.initialize(dialog, dialogRedirection);
        this.newScroller();
    }

}

/**
 * *********************************
 */


export class HasMoreQueryMarker extends NullEntityRec {
    static singleton = new HasMoreQueryMarker();
}

export class IsEmptyQueryMarker extends NullEntityRec {
    static singleton = new IsEmptyQueryMarker();
}

export enum QueryMarkerOption {
    None, IsEmpty, HasMore
}

export class QueryScroller {

    private _buffer:Array<EntityRec>;
    private _hasMoreBackward:boolean;
    private _hasMoreForward:boolean;
    private _nextPagePromise:Promise<RecordSet>;
    private _prevPagePromise:Promise<RecordSet>;
    private _firstResultOid:string;

    constructor(private _context:QueryContext,
                private _pageSize:number,
                private _firstObjectId:string,
                private _markerOptions:Array<QueryMarkerOption> = []) {

        this.clear();

    }

    get buffer():Array<EntityRec> {
        return this._buffer;
    }

    get bufferWithMarkers():Array<EntityRec> {
        var result = ArrayUtil.copy(this._buffer);
        if (this.isComplete) {
            if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                if (this.isEmpty) {
                    result.push(IsEmptyQueryMarker.singleton);
                }
            }
        } else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
            if (result.length === 0) {
                result.push(HasMoreQueryMarker.singleton);
            } else {
                if (this._hasMoreBackward) {
                    result.unshift(HasMoreQueryMarker.singleton)
                }
                if (this._hasMoreForward) {
                    result.push(HasMoreQueryMarker.singleton);
                }
            }
        }
        return result;
    }

    get context():QueryContext {
        return this._context;
    }

    get firstObjectId():string {
        return this._firstObjectId;
    }

    get hasMoreBackward():boolean {
        return this._hasMoreBackward;
    }

    get hasMoreForward():boolean {
        return this._hasMoreForward;
    }

    get isComplete():boolean {
        return !this._hasMoreBackward && !this._hasMoreForward;
    }

    get isCompleteAndEmpty():boolean {
        return this.isComplete && this._buffer.length === 0;
    }

    get isEmpty():boolean {
        return this._buffer.length === 0;
    }

    pageBackward():Promise<Array<EntityRec>> {

        if (!this._hasMoreBackward) {
            return Promise.resolve([]);
        }

        if (this._prevPagePromise) {
            this._prevPagePromise = this._prevPagePromise.then((recordSet: RecordSet) => {
                const fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].id;
                return this._context.query(this._pageSize, QueryDirectionEnum.BACKWARD, fromObjectId);
            });
        } else {
            const fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].id;
            this._prevPagePromise = this._context.query(this._pageSize, QueryDirectionEnum.BACKWARD, fromObjectId);
        }

        const beforeSize: number = this._buffer.length;

        return this._prevPagePromise.then((queryResult: RecordSet) => {
            let afterSize = beforeSize;
            this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.records.length > 0) {
                const newBuffer: Array<EntityRec> = [];
                for (let i = queryResult.records.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.records[i]);
                }
                this._buffer.forEach((entityRec: EntityRec) => {
                    newBuffer.push(entityRec)
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.records;
        });

    }

    pageForward():Promise<Array<EntityRec>> {

        if (!this._hasMoreForward) {
            return Promise.resolve([]);
        }

        if(this._nextPagePromise) {
            this._nextPagePromise = this._nextPagePromise.then((recordSet:RecordSet)=>{
                const fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].id;
                return this._context.query(this._pageSize, QueryDirectionEnum.FORWARD, fromObjectId);
            });
        } else {
            const fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].id;
            this._nextPagePromise = this._context.query(this._pageSize, QueryDirectionEnum.FORWARD, fromObjectId);
        }

        const beforeSize: number = this._buffer.length;

        return this._nextPagePromise.then((queryResult: RecordSet) => {
            let afterSize = beforeSize;
            this._hasMoreForward = queryResult.hasMore;
            if (queryResult.records.length > 0) {
                const newBuffer: Array<EntityRec> = [];
                this._buffer.forEach((entityRec: EntityRec) => {
                    newBuffer.push(entityRec)
                });
                queryResult.records.forEach((entityRec: EntityRec) => {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.records;
        });

    }

    get pageSize():number {
        return this._pageSize;
    }

    refresh():Promise<Array<EntityRec>> {
        this.clear();
        return this.pageForward().then((entityRecList: Array<EntityRec>) => {
            if (entityRecList.length > 0) {
                this._firstResultOid = entityRecList[0].id;
            }
            return entityRecList;
        });
    }

    trimFirst(n:number) {
        const newBuffer = [];
        for (let i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
    }

    trimLast(n:number) {
        var newBuffer = [];
        for (let i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
    }

    private clear() {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
        this._firstResultOid = null;
    }

}

export class ErrorContext extends PaneContext {

    constructor(dialog:Dialog,
                dialogRedirection: DialogRedirection,
                paneRef: number,
                parentContext: PaneContext,
                session: Session,
                appContext:AppContext){

        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);

    }

    protected initialize(dialog:Dialog, dialogRedirection:DialogRedirection) {
        super.initialize(dialog, dialogRedirection);
    }
}


/**
 * EditorContext Subtype that represents a 'Details Pane'.
 * A Details Pane is an Editor Pane with the purpose of displaying property values for a single record,
 * usually as names/values in a tabular arrangement.
 * See {@link DetailsDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class DetailsContext extends EditorContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }


    get details():Details {
        return <Details>this.view;
    }
}

export class BarcodeScanContext extends EditorContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get barcodeScan():BarcodeScan {
        return <BarcodeScan>this.view;
    }
}

export class GpsReadingContext extends EditorContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get gpsLocation():GpsReading {
        return <GpsReading>this.view;
    }
}

export class MapLocationContext extends EditorContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get mapLocation():MapLocation {
        return <MapLocation>this.view;
    }
}

export class PrintMarkupContext extends EditorContext {

    private _printMarkupModel:PrintForm;

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get printMarkup():PrintMarkup {
        return <PrintMarkup>this.view;
    }

    get printMarkupModel():PrintForm {
        if (!this._printMarkupModel) {
            this._printMarkupModel=PrintForm.fromXMLString(this.printMarkup.printMarkupXML);
        }
        return this._printMarkupModel;
    }
}

/**
 * QueryContext Subtype that represents a 'List Pane'.
 * An 'List' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying a tabular list of records.
 * See {@link ListDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class ListContext extends QueryContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get columnHeadings():Array<string> {
        return this.list.columns.map((c:Column)=> {
            return c.heading;
        });
    }

    get list():List {
        return <List>this.view;
    }

    rowValues(entityRec:EntityRec):Array<any> {
        return this.list.columns.map((c:Column)=> {
            return entityRec.valueAtName(c.propertyName);
        });
    }

    get style():string {
        return this.list.style;
    }

}

export class CalendarContext extends QueryContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get calendar():Calendar {
        return <Calendar>this.view;
    }

}

export class GraphContext extends QueryContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get graph():Graph {
        return <Graph>this.view;
    }

}

export class ImagePickerContext extends QueryContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get imagePicker():ImagePicker {
        return <ImagePicker>this.view;
    }

}

/**
 * QueryContext Subtype that represents a 'Map Pane'.
 * A 'Map' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying an annotated map with location markers.
 * See {@link MapDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class MapContext extends QueryContext {

    constructor(dialog:Dialog,
                dialogRedirection:DialogRedirection,
                paneRef:number,
                parentContext:PaneContext,
                session:Session,
                appContext:AppContext

    ) {
        super(dialog, dialogRedirection, paneRef, parentContext, session, appContext);
    }

    get map():Map {
        return <Map>this.view;
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

    getRecord(tenantId:string, sessionId:string, dialogId:string):Promise<EntityRec>;

    putRecord(tenantId:string, sessionId:string, dialogId:string, record:Record):Promise<Record | Redirection>;

    //readProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, readSeq:number, readLength:number):Promise<>;

    //writeProperty(tenantId:string, sessionId:string, dialogId:string, propertyName:string, data:string, append:boolean):Promise<>;

    getRecords(tenantId:string, sessionId:string, dialogId:string, queryParams:QueryParameters):Promise<RecordSet>;

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

    getRecord(tenantId:string, sessionId:string, dialogId:string):Promise<EntityRec> {

        return this.get(`tenants/${tenantId}/sessions/${sessionId}/dialogs/${dialogId}/record`).then(
            jsonClientResponse=>(new DialogServiceResponse<EntityRec>(jsonClientResponse)).responseValue()
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
            if(this.hasMessage) {
                reject(<DialogMessage>this.clientResponse.value);
            } else {
                this.fullfillJsonToModel<T>(this.clientResponse, resolve, reject);
            }
        });
    }

    responseValueOrRedirect():Promise<T | Redirection> {
        return new Promise((resolve, reject)=> {
            if(this.hasMessage) {
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

export interface VoidResult {
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


export class Attachment {

    constructor(public name:string, public attachmentData:any) {};

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
        let lang:string = null;
        // The locale from the browser is not reliable.  The Extender server pulls the browser's locale from the
        // agent string at logon time.  Use that with a fallback approach to find the best fit locale.
        // var localeTest = window.navigator.userLanguage || window.navigator.language;
        if (AppContext.singleton.browserLocaleJson) {
            let browserLocale = JSON.parse(AppContext.singleton.browserLocaleJson);  // country/language/varient
            if (browserLocale.country) {
                let key = browserLocale.language + "-" + browserLocale.country.toLowerCase();
                if (moment().lang(key)) {
                    lang = key;
                }
            }
            if (!lang) {
                let x = moment().lang(browserLocale.language);
                if (moment().lang(browserLocale.language)) {
                    lang = browserLocale.language;
                }
            }
            if (!lang) {
                lang = "en";
            }
        }
        // let test = (moment as any).locales();
        if(value === null || value === undefined) {
            return '';
        } else if ((propDef && propDef.isCodeRefType) || value instanceof CodeRef) {
            return (value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || value instanceof ObjectRef) {
            return (value as ObjectRef).description;
        }else if ((propDef && propDef.isDateTimeType)) {
            if (!lang) {
                return (value as Date).toString();
            } else {
                return moment(value as Date).locale(lang).format("lll");
                // return moment(value as Date).format("lll");
            }
        } else if ((propDef && propDef.isDateType) || value instanceof Date) {
            if (!lang) {
                return (value as Date).toLocaleDateString();
            } else {
                return moment(value as Date).locale(lang).format("L");
                // return moment(value as Date).format("L");
            }
        } else if ((propDef && propDef.isTimeType) || value instanceof TimeValue) {
            if (!lang) {
                return moment(value as TimeValue).format("LT");
            } else {
                return moment(value as TimeValue).locale(lang).format("LT");
                // return moment(value as TimeValue).format("LT");
            }
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
            } else if (o instanceof GpsReadingProperty) {
                return o.toString();
            } else if (o instanceof MapLocationProperty) {
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
