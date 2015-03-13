/**
 * Created by rburson on 3/13/15.
 */

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

        private _appContextState:AppContextState;
        private _appWinDefTry:Try<AppWinDef>;
        private _deviceProps:Array<string>;
        private _lastMaintenanceTime:Date;
        private _sessionContextTry:Try<SessionContext>;
        private _tenantSettingsTry:Try<StringDictionary>;


        static singleton():AppContext {
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

        private setAppContextStateToLoggedOut() {
            
        }


    }
}