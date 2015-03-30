/**
 * Created by rburson on 3/19/15.
 */

///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.dialog {

    var SERVICE_PATH = "www.catavolt.net";
    var tenantId = "***REMOVED***";
    var userId = "sales";
    var password = "***REMOVED***";
    var clientType = "LIMITED_ACCESS";

    describe("AppContext::login", function () {
        it("should login successfully with valid creds", function (done) {
            AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(
                (appWinDefTry:Try<AppWinDef>)=>{
                    Log.info(Log.formatRecString(appWinDefTry));
                    Log.info(Log.formatRecString(AppContext.singleton.sessionContextTry));
                    Log.info(Log.formatRecString(AppContext.singleton.tenantSettingsTry));
                    expect(AppContext.singleton.appWinDefTry.success.workbenches.length).toBeGreaterThan(0);
                    done();
                }
            );
        });
    });

    describe("AppContext::performLaunchAction", function () {
        it("should login successfully with valid creds", function (done) {
            var launchAction:WorkbenchLaunchAction = AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
            AppContext.singleton.performLaunchAction(launchAction).onComplete((navRequestTry:Try<NavRequest>)=>{
                if(navRequestTry.isFailure) {
                    Log.debug(navRequestTry.failure);
                }
                expect(navRequestTry.isSuccess).toBeTruthy();
                done();
            });
        });
    });


}