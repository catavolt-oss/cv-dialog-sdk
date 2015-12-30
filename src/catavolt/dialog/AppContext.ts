/**
 * Created by rburson on 3/13/15.
 */

import {NavRequest} from './NavRequest';
import {WorkbenchLaunchAction} from './WorkbenchLaunchAction';
import {AppWinDef} from './AppWinDef';
import {Workbench} from './Workbench';
import {WorkbenchService} from './WorkbenchService';
import {SystemContextImpl} from './SystemContextImpl';
import {VoidResult} from './VoidResult';
import {SessionService} from './SessionService';
import {XGetSessionListPropertyResult} from './XGetSessionListPropertyResult';
import {ServiceEndpoint} from './ServiceEndpoint';
import {GatewayService} from './GatewayService';
import {Redirection} from './Redirection';
import {SystemContext} from '../ws/SystemContext';
import {SessionContext} from '../ws/SessionContext';
import {Future} from '../fp/Future';
import {Try} from '../fp/Try';
import {Success} from '../fp/Success';
import {Failure} from '../fp/Failure';
import {StringDictionary} from '../util/Types';
import {Log} from '../util/Log';
import {ObjUtil} from '../util/ObjUtil';
import {NavRequestUtil} from "./NavRequest";


enum AppContextState { LOGGED_OUT, LOGGED_IN }

class AppContextValues {
    constructor(public sessionContext:SessionContext,
                public appWinDef:AppWinDef,
                public tenantSettings:StringDictionary) {
    }
}

export class AppContext {

    private static _singleton:AppContext;

    private static ONE_DAY_IN_MILLIS:number = 60 * 60 * 24 * 1000;

    public lastMaintenanceTime:Date;
    private _appContextState:AppContextState;
    private _appWinDefTry:Try<AppWinDef>;
    private _deviceProps:Array<string>;
    private _sessionContextTry:Try<SessionContext>;
    private _tenantSettingsTry:Try<StringDictionary>;

    public static get defaultTTLInMillis():number {
        return AppContext.ONE_DAY_IN_MILLIS;
    }

    static get singleton():AppContext {
        if (!AppContext._singleton) {
            AppContext._singleton = new AppContext();
        }
        return AppContext._singleton;
    }

    constructor() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }

    get appWinDefTry():Try<AppWinDef> {
        return this._appWinDefTry;
    }

    get deviceProps():Array<string> {
        return this._deviceProps;
    }

    get isLoggedIn() {
        return this._appContextState === AppContextState.LOGGED_IN;
    }

    getWorkbench(sessionContext:SessionContext, workbenchId:string):Future<Workbench> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture<Workbench>("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    }

    login(gatewayHost:string,
          tenantId:string,
          clientType:string,
          userId:string,
          password:string):Future<AppWinDef> {

        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture<AppWinDef>("AppContext::login", "User is already logged in");
        }

        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
            }
        );


    }

    loginDirectly(url:string,
                  tenantId:string,
                  clientType:string,
                  userId:string,
                  password:string):Future<AppWinDef> {

        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture<AppWinDef>("AppContext::loginDirectly", "User is already logged in");
        }

        return this.loginFromSystemContext(new SystemContextImpl(url), tenantId, userId,
            password, this.deviceProps, clientType).bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
            }
        );
    }

    logout():Future<VoidResult> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture<AppWinDef>("AppContext::loginDirectly", "User is already logged out");
        }
        var result:Future<VoidResult> = SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(deleteSessionTry => {
            if (deleteSessionTry.isFailure) {
                Log.error('Error while logging out: ' + ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    }


    performLaunchAction(launchAction:WorkbenchLaunchAction):Future<NavRequest> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    }

    refreshContext(sessionContext:SessionContext, deviceProps:Array<string> = []):Future<AppWinDef> {
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
            }
        );
    }

    get sessionContextTry():Try<SessionContext> {
        return this._sessionContextTry;
    }

    get tenantSettingsTry():Try<StringDictionary> {
        return this._tenantSettingsTry;
    }

    private finalizeContext(sessionContext:SessionContext, deviceProps:Array<string>):Future<AppContextValues> {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(
            (setPropertyListResult:VoidResult)=> {
                var listPropName = "com.catavolt.session.property.TenantProperties";
                return SessionService.getSessionListProperty(listPropName, sessionContext).bind(
                    (listPropertyResult:XGetSessionListPropertyResult)=> {
                        return WorkbenchService.getAppWinDef(sessionContext).bind(
                            (appWinDef:AppWinDef)=> {
                                return Future.createSuccessfulFuture<AppContextValues>("AppContextCore:loginFromSystemContext",
                                    new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                            }
                        );
                    }
                );
            }
        );
    }

    private loginOnline(gatewayHost:string,
                        tenantId:string,
                        clientType:string,
                        userId:string,
                        password:string,
                        deviceProps:Array<string>):Future<AppContextValues> {

        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind(
            (sc:SystemContext)=> {
                return this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
            }
        );
    }

    private loginFromSystemContext(systemContext:SystemContext,
                                   tenantId:string,
                                   userId:string,
                                   password:string,
                                   deviceProps:Array<string>,
                                   clientType:string):Future<AppContextValues> {

        var sessionContextFuture = SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind(
            (sessionContext:SessionContext)=> {
                return this.finalizeContext(sessionContext, deviceProps);
            }
        );
    }

    private newSystemContextFr(gatewayHost:string, tenantId:string):Future<SystemContext> {
        var serviceEndpoint:Future<ServiceEndpoint> = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map(
            (serviceEndpoint:ServiceEndpoint)=> {
                return new SystemContextImpl(serviceEndpoint.serverAssignment);
            }
        );
    }

    private performLaunchActionOnline(launchAction:WorkbenchLaunchAction,
                                      sessionContext:SessionContext):Future<NavRequest> {

        var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind<NavRequest>((r:Redirection)=> {
            return NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    }

    private setAppContextStateToLoggedIn(appContextValues:AppContextValues) {
        this._appWinDefTry = new Success<AppWinDef>(appContextValues.appWinDef);
        this._tenantSettingsTry = new Success<StringDictionary>(appContextValues.tenantSettings);
        this._sessionContextTry = new Success<SessionContext>(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    }

    private setAppContextStateToLoggedOut() {
        this._appWinDefTry = new Failure<AppWinDef>("Not logged in");
        this._tenantSettingsTry = new Failure<StringDictionary>('Not logged in"');
        this._sessionContextTry = new Failure<SessionContext>('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    }

}
