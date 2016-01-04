/**
 * Created by rburson on 3/19/15.
 */
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SERVICE_PATH = "www.catavolt.net";
        var tenantId = "***REMOVED***z";
        var userId = "sales";
        var password = "***REMOVED***";
        var clientType = "LIMITED_ACCESS";
        xdescribe("AppContext::login", function () {
            it("should login successfully with valid creds", function (done) {
                dialog.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(function (appWinDefTry) {
                    Log.info(Log.formatRecString(appWinDefTry));
                    Log.info(Log.formatRecString(dialog.AppContext.singleton.sessionContextTry));
                    Log.info(Log.formatRecString(dialog.AppContext.singleton.tenantSettingsTry));
                    expect(dialog.AppContext.singleton.appWinDefTry.success.workbenches.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
        xdescribe("AppContext::performLaunchAction", function () {
            it("should peform launch action successfully", function (done) {
                var launchAction = dialog.AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
                dialog.AppContext.singleton.performLaunchAction(launchAction).onComplete(function (navRequestTry) {
                    Log.debug("completed with: " + navRequestTry);
                    if (navRequestTry.isFailure) {
                        Log.debug(navRequestTry.failure);
                    }
                    expect(navRequestTry.isSuccess).toBeTruthy();
                    done();
                });
            });
        });
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
