///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.dialog {

    var SERVICE_PATH = "www.catavolt.net";
    var tenantId = "***REMOVED***z";
    var userId = "sales";
    var password = "***REMOVED***";
    var clientType = "LIMITED_ACCESS";

    describe("Api Usage", function () {

        it("Should run API Examples", function (done) {
            loginWithAppContext();
        });

    });

    function loginWithAppContext():Future<void> {

        AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(
            (appWinDefTry:Try<AppWinDef>)=>{
                if(appWinDefTry.isFailure) {
                   Log.info('Login failed with ' + Log.formatRecString(appWinDefTry.failure));
                } else {
                    Log.info('Login Succeeded');
                    Log.info('AppWinDef: ' + Log.formatRecString(appWinDefTry.success));
                    Log.info('SessionContext: ' + Log.formatRecString(AppContext.singleton.sessionContextTry.success));
                    Log.info('TenantSettings: ' + Log.formatRecString(AppContext.singleton.tenantSettingsTry.success));
                    setupWorkbench().onComplete((result:Try<void>)=>{

                    });
                }
            }
        );
    }

    function setupWorkbench():Future<void> {
        return null;
    }

    function launchWorkbenchActions():Future<void> {
        return null;
    }

    function performLaunchAction(launchAction:WorkbenchLaunchAction):Future<void> {
        var launchAction:WorkbenchLaunchAction = AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
        AppContext.singleton.performLaunchAction(launchAction).onComplete((navRequestTry:Try<NavRequest>)=>{
            Log.debug("completed with: " + navRequestTry);
            if(navRequestTry.isFailure) {
                Log.debug(navRequestTry.failure);
            }
            expect(navRequestTry.isSuccess).toBeTruthy();
        });
    }

    function getLaunchActionByName(name:string, workbenches:Array<Workbench>):Future<void> {
        return null;
    }

    function handleNavRequest(navRequest:NavRequest):Future<void>{
        if(navRequest instanceof FormContext){
        } else {
        }
        return null;
    }

    function handleFormContext(formContext:FormContext):Future<void> {
        return null;
    }

    function displayMenus(paneContext:PaneContext):Future<void> {
        return null;
    }

    function showMenu(menuDef:MenuDef):Future<void>{
        return null;
    }

    function handleListContext(listContext:ListContext):Future<void> {
        return null;
    }

    function handleDetailsContext(detailsContext:DetailsContext):Future<void> {
        return null;
    }





}