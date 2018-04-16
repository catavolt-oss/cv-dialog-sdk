import { StreamConsumer } from '../io/StreamConsumer';
import { StreamProducer } from '../io/StreamProducer';
import {
    ClientType,
    Dialog,
    DialogRedirection,
    Form,
    Login,
    NullRedirection,
    PropertyFormatter,
    Redirection,
    RedirectionUtil,
    Session,
    TypeNames,
    WorkbenchAction
} from '../models';
import { LargeProperty } from '../models/LargeProperty';
import { ReadLargePropertyParameters } from '../models/ReadLargePropertyParameters';
import { DialogProxy } from '../proxy/DialogProxy';
import { CvLocale } from '../util/CvLocale';
import { Log } from '../util/Log';
import { ObjUtil } from '../util/ObjUtil';
import { FetchClient } from '../ws/FetchClient';
import { CatavoltApi } from './CatavoltApi';
import { DialogApi } from './DialogApi';
import { DialogService } from './DialogService';

/**
 * Top-level entry point into the Catavolt API
 */
export class CatavoltApiImpl implements CatavoltApi {
    private static _singleton: CatavoltApiImpl;

    private static ONE_HOUR_IN_MILLIS: number = 60 * 60 * 1000;
    // defaults
    private static SERVER_URL: string = 'https://dialog.hxgn-api.net';
    private static SERVER_VERSION = 'v0';

    public readonly DEFAULT_LOCALE: CvLocale = new CvLocale('en');

    public dataLastChangedTime: Date = new Date(0);
    private _dialogApi: DialogApi;
    private _session: Session;
    private _devicePropsDynamic: { [index: string]: () => string };
    private _devicePropsStatic: { [index: string]: string };

    private _locale: CvLocale = null;

    /* ********************
            Statics
     *********************** */

    /**
     * Get the default session time
     * @returns {number}
     */
    public static get defaultTTLInMillis(): number {
        return CatavoltApiImpl.ONE_HOUR_IN_MILLIS;
    }

    /**
     * Get the singleton instance of the CatavoltApiImpl
     * @returns {CatavoltApiImpl}
     */
    static get singleton(): CatavoltApiImpl {
        if (!CatavoltApiImpl._singleton) {
            CatavoltApiImpl._singleton = new CatavoltApiImpl(
                CatavoltApiImpl.SERVER_URL,
                CatavoltApiImpl.SERVER_VERSION
            );
        }
        return CatavoltApiImpl._singleton;
    }

    /**
     * Construct an CatavoltApiImpl
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    private constructor(serverUrl: string, serverVersion: string) {
        if (CatavoltApiImpl._singleton) {
            throw new Error('Singleton instance already created');
        }
        this._devicePropsStatic = {};
        this._devicePropsDynamic = {};

        this.initDialogApi(serverUrl, serverVersion);

        CatavoltApiImpl._singleton = this;
    }

    /* *****************
        Public Ops
       ******************* */

    /**
     * Add or replace a dynamic device property (func)
     * @param propName
     * @param propFn
     */
    public addDynamicDeviceProp(propName: string, propFn: () => string): void {
        this._devicePropsDynamic[propName] = propFn;
    }

    /**
     * Add or replace a static device property
     *
     * @param propName
     * @param propValue
     */
    public addStaticDeviceProp(propName: string, propValue: string): void {
        this._devicePropsStatic[propName] = propValue;
    }

    /**
     * Get the preferred locale
     * @returns {CvLocale}
     */
    get locale(): CvLocale {
        if (!this._locale) {
            const defaultLocale = this.session.tenantProperties.browserLocale;
            if (defaultLocale) {
                try {
                    const localeJson = JSON.parse(defaultLocale);
                    if (localeJson.language) {
                        this._locale = new CvLocale(localeJson.language, localeJson.country);
                    }
                } catch (err) {
                    this._locale = this.DEFAULT_LOCALE;
                }
            }
        }

        if (!this._locale) {
            this._locale = this.DEFAULT_LOCALE;
        }

        return this._locale;
    }

    set locale(locale: CvLocale) {
        this._locale = locale;
    }

    /*@TODO*/
    public changePasswordAndLogin(
        tenantId: string,
        clientType: ClientType,
        userId: string,
        existingPassword: string,
        newPassword: string
    ): Promise<Session | Redirection> {
        return Promise.reject(new Error('Not Yet Implemented'));
    }

    /**
     * Get the number of millis that the client will remain active between calls
     * to the server.
     * @returns {number}
     */
    get clientTimeoutMillis(): number {
        const mins = this.session.tenantProperties.clientTimeoutMinutes;
        return mins ? Number(mins) * 60 * 1000 : CatavoltApiImpl.defaultTTLInMillis;
    }

    /**
     * Get the currency symbol override if defined from the server.
     * @returns {string}
     */
    get currencySymbol(): string {
        const currencySymbol = this.session.tenantProperties.currencySymbol;
        return currencySymbol ? currencySymbol : null;
    }

    /**
     * Get the device props
     * @returns {{[p: string]: string}}
     */
    get deviceProps(): { [index: string]: string } {
        const newProps: { [index: string]: string } = ObjUtil.addAllProps(this._devicePropsStatic, {});
        for (const attr in this._devicePropsDynamic) {
            if (this._devicePropsDynamic.hasOwnProperty(attr)) {
                newProps[attr] = this._devicePropsDynamic[attr]();
            }
        }
        return newProps;
    }

    /**
     * Get the DialogApi instance
     * @returns {DialogApi}
     */
    get dialogApi(): DialogApi {
        return this._dialogApi;
    }

    /**
     * Initialize a dialog service implementation for use by this CatavoltApiImpl
     *
     * @param serverVersion
     * @param serverUrl
     */
    public initDialogApi(serverUrl: string, serverVersion: string = CatavoltApiImpl.SERVER_VERSION): void {
        this._dialogApi = new DialogService(new FetchClient(), serverUrl, serverVersion);
        // @TODO this will be the future!
        // this._dialogApi = new DialogService(new DialogProxy(), serverUrl, serverVersion);
    }

    /**
     * Check for the availability of the given featureSet
     * @see FeatureSet
     * @param featureSet
     * @returns {boolean}
     */
    public isFeatureSetAvailable(featureSet: FeatureSet): boolean {
        try {
            const currentVersion = AppVersion.getAppVersion(this.session.serverVersion);
            const featureMinimumVersion = FeatureVersionMap[featureSet];
            return featureMinimumVersion.isLessThanOrEqualTo(currentVersion);
        } catch (error) {
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
    public login(
        tenantId: string,
        clientType: ClientType,
        userId: string,
        password: string
    ): Promise<Session | Redirection> {
        if (this.isLoggedIn) {
            return this.logout().then(result => this.processLogin(tenantId, clientType, userId, password));
        } else {
            return this.processLogin(tenantId, clientType, userId, password);
        }
    }

    /**
     * Logout and destroy the session
     * @returns {{sessionId:string}}
     */
    public logout(): Promise<{ sessionId: string }> {
        if (this.isLoggedIn) {
            const sessionId = this.session.id;
            return this.dialogApi
                .deleteSession(this.session.tenantId, this.session.id)
                .then(result => {
                    this._session = null;
                    return result;
                })
                .catch(error => {
                    Log.error(`Error logging out ${error}`);
                    this._session = null;
                    return { sessionId };
                });
        } else {
            return Promise.resolve({ sessionId: null });
        }
    }

    public openDialogWithId(dialogId: string): Promise<Dialog> {
        return this.dialogApi.getDialog(this.session.tenantId, this.session.id, dialogId).then((dialog: Dialog) => {
            dialog.initialize(this);
            if (dialog.view instanceof Form) {
                return dialog;
            } else {
                throw new Error(`Unexpected top-level dialog view type: ${dialog.view.type}`);
            }
        });
    }

    public openDialog(redirection: DialogRedirection): Promise<Dialog> {
        return this.openDialogWithId(redirection.dialogId);
    }

    /**
     * Not yet implemented
     * @param {string} url
     * @returns {Promise<StreamProducer>}
     */
    public openStream(url: string): Promise<StreamProducer> {
        // return this.dialogApi.streamUrl(null, null, url);
        throw Error('not yet implemented');
    }

    public toDialogOrRedirection(resultPr: Promise<{}>): Promise<Dialog | Redirection> {
        return resultPr.then((actionResult: {}) => {
            if (RedirectionUtil.isDialogRedirection(actionResult)) {
                return this.openDialog(actionResult as DialogRedirection) as Promise<Dialog | Redirection>;
            } else if (RedirectionUtil.isRedirection(actionResult)) {
                return Promise.resolve(actionResult) as Promise<Dialog | Redirection>;
            } else {
                // @TODO - this shouldn't be a null redirection - what should it be?
                return Promise.resolve(actionResult as NullRedirection);
            }
        });
    }

    public getRedirection(redirectionId: string): Promise<Redirection> {
        return this.dialogApi.getRedirection(this.session.tenantId, this.session.id, redirectionId);
    }

    /**
     * Open a {@link WorkbenchAction}
     * @param workbenchAction
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    public performWorkbenchAction(workbenchAction: WorkbenchAction): Promise<Redirection> {
        return this.performWorkbenchActionForId(workbenchAction.workbenchId, workbenchAction.id);
    }

    /**
     * Open a {@link WorkbenchWorkbenchAction}
     * @param workbenchId
     * @param workbenchActionId
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    public performWorkbenchActionForId(workbenchId: string, workbenchActionId: string): Promise<Redirection> {
        if (!this.isLoggedIn) {
            return Promise.reject(new Error('User is not logged in'));
        }

        return this.dialogApi.performWorkbenchAction(
            this.session.tenantId,
            this.session.id,
            workbenchId,
            workbenchActionId
        );
    }

    /**
     * Refresh the CatavoltApiImpl
     *
     * @returns {Promise<Session>}
     */
    public refreshSession(tenantId: string, sessionId: string): Promise<Session> {
        return this.dialogApi.getSession(tenantId, sessionId).then(session => {
            this._session = session;
            return session;
        });
    }

    /**
     * Time remaining before this session is expired by the server
     * @returns {number}
     */
    get remainingSessionTime(): number {
        return this.clientTimeoutMillis - (new Date().getTime() - this.dialogApi.lastServiceActivity.getTime());
    }

    /**
     * Get the Session
     * @returns {Session}
     */
    get session(): Session {
        return this._session;
    }

    /**
     * Return whether or not the session has expired
     * @returns {boolean}
     */
    get sessionHasExpired(): boolean {
        return this.remainingSessionTime < 0;
    }

    /**
     *
     * @param {string} contentId
     * @param {StreamConsumer} streamConsumer
     * @returns {Promise<LargeProperty>}
     */
    public streamContent(contentId: string, streamConsumer: StreamConsumer): Promise<LargeProperty> {
        const getDialogContent = this.getDialogContent.bind(this);
        return Dialog.loadLargeProperty(getDialogContent, streamConsumer, contentId);
    }

    public getDialogContent (params: ReadLargePropertyParameters, contentId: string): Promise<LargeProperty> {
        return this.dialogApi.getContent(this.session.tenantId, this.session.id, contentId, params);
    }

    private processLogin(
        tenantId: string,
        clientType: ClientType,
        userId: string,
        password: string
    ): Promise<Session | Redirection> {
        const login: Login = {
            userId,
            password,
            clientType,
            deviceProperties: this.deviceProps,
            type: TypeNames.LoginTypeName
        };

        return this.dialogApi.createSession(tenantId, login).then((result: Session | Redirection) => {
            if (result.type === TypeNames.SessionTypeName) {
                this._session = result as Session;
                return result;
            } else {
                return result;
            }
        });
    }
}

class AppVersion {
    public static getAppVersion(versionString: string): AppVersion {
        const [major, minor, patch] = versionString.split('.');
        return new AppVersion(Number(major || 0), Number(minor || 0), Number(patch || 0));
    }

    constructor(public major: number, public minor: number, public patch: number) {}

    /**
     * Is 'this' version less than or equal to the supplied version?
     * @param anotherVersion - the version to compare to 'this' version
     * @returns {boolean}
     */
    public isLessThanOrEqualTo(anotherVersion: AppVersion): boolean {
        if (anotherVersion.major > this.major) {
            return true;
        } else if (anotherVersion.major === this.major) {
            if (anotherVersion.minor > this.minor) {
                return true;
            } else if (anotherVersion.minor === this.minor) {
                return anotherVersion.patch >= this.patch;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

export type FeatureSet = 'View_Support' | 'Unified_Search';
const FeatureVersionMap: { [featureSet: string]: AppVersion } = {
    View_Support: AppVersion.getAppVersion('1.3.447'),
    Unified_Search: AppVersion.getAppVersion('1.3.463')
};

export const Catavolt: CatavoltApi = CatavoltApiImpl.singleton;
export const propertyFormatter: PropertyFormatter = PropertyFormatter.singleton(Catavolt);
