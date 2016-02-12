/**
 * Created by rburson on 3/13/15.
 */
import { WorkbenchService } from './WorkbenchService';
import { SystemContextImpl } from './SystemContextImpl';
import { SessionService } from './SessionService';
import { GatewayService } from './GatewayService';
import { Future } from '../fp/Future';
import { Success } from '../fp/Success';
import { Failure } from '../fp/Failure';
import { Log } from '../util/Log';
import { ObjUtil } from '../util/ObjUtil';
import { NavRequestUtil } from "./NavRequest";
var AppContextState;
(function (AppContextState) {
    AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
    AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
})(AppContextState || (AppContextState = {}));
class AppContextValues {
    constructor(sessionContext, appWinDef, tenantSettings) {
        this.sessionContext = sessionContext;
        this.appWinDef = appWinDef;
        this.tenantSettings = tenantSettings;
    }
}
export class AppContext {
    constructor() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }
    static get defaultTTLInMillis() {
        return AppContext.ONE_DAY_IN_MILLIS;
    }
    static get singleton() {
        if (!AppContext._singleton) {
            AppContext._singleton = new AppContext();
        }
        return AppContext._singleton;
    }
    get appWinDefTry() {
        return this._appWinDefTry;
    }
    get deviceProps() {
        return this._deviceProps;
    }
    get isLoggedIn() {
        return this._appContextState === AppContextState.LOGGED_IN;
    }
    getWorkbench(sessionContext, workbenchId) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    }
    login(gatewayHost, tenantId, clientType, userId, password) {
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture("AppContext::login", "User is already logged in");
        }
        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    }
    loginDirectly(url, tenantId, clientType, userId, password) {
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
        }
        return this.loginFromSystemContext(new SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
        });
    }
    logout() {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
        }
        var result = SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(deleteSessionTry => {
            if (deleteSessionTry.isFailure) {
                Log.error('Error while logging out: ' + ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    }
    performLaunchAction(launchAction) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    }
    refreshContext(sessionContext, deviceProps = []) {
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    }
    get sessionContextTry() {
        return this._sessionContextTry;
    }
    get tenantSettingsTry() {
        return this._tenantSettingsTry;
    }
    finalizeContext(sessionContext, deviceProps) {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind((setPropertyListResult) => {
            var listPropName = "com.catavolt.session.property.TenantProperties";
            return SessionService.getSessionListProperty(listPropName, sessionContext).bind((listPropertyResult) => {
                return WorkbenchService.getAppWinDef(sessionContext).bind((appWinDef) => {
                    return Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                });
            });
        });
    }
    loginOnline(gatewayHost, tenantId, clientType, userId, password, deviceProps) {
        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind((sc) => {
            return this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
        });
    }
    loginFromSystemContext(systemContext, tenantId, userId, password, deviceProps, clientType) {
        var sessionContextFuture = SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind((sessionContext) => {
            return this.finalizeContext(sessionContext, deviceProps);
        });
    }
    newSystemContextFr(gatewayHost, tenantId) {
        var serviceEndpoint = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map((serviceEndpoint) => {
            return new SystemContextImpl(serviceEndpoint.serverAssignment);
        });
    }
    performLaunchActionOnline(launchAction, sessionContext) {
        var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind((r) => {
            return NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    }
    setAppContextStateToLoggedIn(appContextValues) {
        this._appWinDefTry = new Success(appContextValues.appWinDef);
        this._tenantSettingsTry = new Success(appContextValues.tenantSettings);
        this._sessionContextTry = new Success(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    }
    setAppContextStateToLoggedOut() {
        this._appWinDefTry = new Failure("Not logged in");
        this._tenantSettingsTry = new Failure('Not logged in"');
        this._sessionContextTry = new Failure('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    }
}
AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
//# sourceMappingURL=AppContext.js.map