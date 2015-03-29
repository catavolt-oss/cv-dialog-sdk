/**
 * Created by rburson on 3/13/15.
 */

///<reference path="references.ts"/>
///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>
///<reference path="../ws/references.ts"/>

module catavolt.dialog {

    enum AppContextState { LOGGED_OUT, LOGGED_IN }

    class AppContextValues {
        constructor(public sessionContext:SessionContext,
                    public appWinDef:AppWinDef,
                    public tenantSettings:StringDictionary) {}
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

        public static get defaultTTLInMillis(): number { return AppContext.ONE_DAY_IN_MILLIS; }

        static get singleton():AppContext {
            if(!AppContext._singleton) {
                AppContext._singleton =  new AppContext();
            }
            return AppContext._singleton;
        }

        constructor() {
            if(AppContext._singleton) {
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

        login(gatewayHost:string,
              tenantId:string,
              clientType:string,
              userId:string,
              password:string):Future<AppWinDef>{

            if(this._appContextState === AppContextState.LOGGED_IN) {
                return Future.createFailedFuture<AppWinDef>("AppContext::login", "User is already logged in");
            }

            var answer;
            var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
            return appContextValuesFr.bind(
                (appContextValues:AppContextValues)=>{
                    this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
                }
            );


        }

        performLaunchAction(launchAction:WorkbenchLaunchAction):Future<NavRequest> {
            if(this._appContextState === AppContextState.LOGGED_OUT) {
                return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
            }
            return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
        }

        performLaunchActionOnline(launchAction:WorkbenchLaunchAction,
                                  sessionContext:SessionContext):Future<NavRequest> {

            var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);

            /*redirFr.bind<NavRequest>((r:Redirection)=>{
            });*/

            return null;
        }

        get sessionContextTry():Try<SessionContext> {
            return this._sessionContextTry;
        }

        get tenantSettingsTry():Try<StringDictionary>{
            return this._tenantSettingsTry;
        }

        private finalizeContext(sessionContext:SessionContext, deviceProps:Array<string>): Future<AppContextValues> {
            var devicePropName = "com.catavolt.session.property.DeviceProperties";
            return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(
                (setPropertyListResult:VoidResult)=>{
                    var listPropName = "com.catavolt.session.property.TenantProperties";
                    return SessionService.getSessionListProperty(listPropName, sessionContext).bind(
                        (listPropertyResult:XGetSessionListPropertyResult)=>{
                            return WorkbenchService.getAppWinDef(sessionContext).bind(
                                (appWinDef:AppWinDef)=>{
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
                (sc:SystemContext)=>{
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
                (sessionContext:SessionContext)=>{
                    return this.finalizeContext(sessionContext, deviceProps);
                }
            );
        }

        private newSystemContextFr(gatewayHost:string, tenantId:string):Future<SystemContext> {
            var serviceEndpoint:Future<ServiceEndpoint> = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
            return serviceEndpoint.map(
                (serviceEndpoint:ServiceEndpoint)=>{
                   return new SystemContextImpl(serviceEndpoint.serverAssignment);
                }
            );
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
}