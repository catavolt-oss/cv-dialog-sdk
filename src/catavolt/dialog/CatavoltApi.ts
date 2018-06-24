import {ClientListener} from "../client/ClientListener";
import { StreamConsumer } from '../io/StreamConsumer';
import { StreamProducer } from '../io/StreamProducer';
import { ClientType, Dialog, DialogRedirection, Redirection, Session, WorkbenchAction } from '../models';
import { LargeProperty } from '../models/LargeProperty';
import { CvLocale } from '../util';
import { FeatureSet } from './Catavolt';
import { DialogApi } from './DialogApi';

export interface CatavoltApi {
    dataLastChangedTime: Date;
    locale: CvLocale;
    readonly clientTimeoutMillis: number;
    readonly currencySymbol: string;
    readonly deviceProps: { [p: string]: string };
    readonly dialogApi: DialogApi;
    readonly isLoggedIn: boolean;
    readonly isOffline: boolean;
    readonly remainingSessionTime: number;
    readonly session: Session;
    readonly sessionHasExpired: boolean;

    readonly DEFAULT_LOCALE: CvLocale;

    /**
     *
     * @param {ClientListener} clientListener
     */
    addClientListener(clientListener:ClientListener): void;

    /**
     * Add or replace a dynamic device property (func)
     * @param propName
     * @param propFn
     */
    addDynamicDeviceProp(propName: string, propFn: () => string): void;

    /**
     * Add or replace a static device property
     *
     * @param propName
     * @param propValue
     */
    addStaticDeviceProp(propName: string, propValue: string): void;

    changePasswordAndLogin(
        tenantId: string,
        clientType: ClientType,
        userId: string,
        existingPassword: string,
        newPassword: string
    ): Promise<Session | Redirection>;

    /**
     * Initialize a dialog service implementation for use by this CatavoltApiImpl
     *
     * @param serverVersion
     * @param serverUrl
     */
    initDialogApi(serverUrl: string, serverVersion: string): void;

    /**
     * Check for the availability of the given featureSet
     * @see FeatureSet
     * @param featureSet
     * @returns {boolean}
     */
    isFeatureSetAvailable(featureSet: FeatureSet): boolean;

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
    login(tenantId: string, clientType: ClientType, userId: string, password: string): Promise<Session | Redirection>;

    loginWithToken(
        tenantId: string,
        clientType: ClientType,
        permissionToken: string,
        proofKey: string
    ): Promise<Session | Redirection>;
    /**
     * Logout and destroy the session
     * @returns {{sessionId:string}}
     */
    logout(): Promise<{ sessionId: string }>;

    openDialogWithId(dialogId: string): Promise<Dialog>;

    openDialog(redirection: DialogRedirection): Promise<Dialog>;

    openStream(url: string): Promise<StreamProducer>;

    toDialogOrRedirection(resultPr: Promise<{}>): Promise<Dialog | Redirection>;

    getRedirection(redirectionId: string): Promise<Redirection>;

    /**
     * Open a {@link WorkbenchAction}
     * @param workbenchAction
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performWorkbenchAction(workbenchAction: WorkbenchAction): Promise<{ actionId: string } | Redirection>;

    /**
     * Open a {@link WorkbenchWorkbenchAction}
     * @param workbenchId
     * @param workbenchActionId
     * @returns {Promise<{actionId:string} | Redirection>}
     */
    performWorkbenchActionForId(
        workbenchId: string,
        workbenchActionId: string
    ): Promise<{ actionId: string } | Redirection>;

    /**
     * Refresh the CatavoltApiImpl
     *
     * @returns {Promise<Session>}
     */
    refreshSession(tenantId: string, sessionId: string): Promise<Session>;

    /**
     *
     * @param {ClientListener} clientListener
     */
    removeClientListener(clientListener:ClientListener): void;
    /**
     *
     * @param {string} contentId
     * @param {StreamConsumer} streamConsumer
     * @returns {Promise<LargeProperty>}
     */
    streamContent(contentId: string, streamConsumer: StreamConsumer): Promise<LargeProperty>;
}
