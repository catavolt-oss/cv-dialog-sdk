/**
 * Created by rburson on 3/19/15.
 */
"use strict";
var catavolt_1 = require('../src/catavolt');
var catavolt_2 = require('../src/catavolt');
var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";
xdescribe("AppContext::login", function () {
    it("should login successfully with valid creds", function (done) {
        catavolt_2.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(function (appWinDefTry) {
            catavolt_1.Log.info(catavolt_1.Log.formatRecString(appWinDefTry));
            catavolt_1.Log.info(catavolt_1.Log.formatRecString(catavolt_2.AppContext.singleton.sessionContextTry));
            catavolt_1.Log.info(catavolt_1.Log.formatRecString(catavolt_2.AppContext.singleton.tenantSettingsTry));
            expect(catavolt_2.AppContext.singleton.appWinDefTry.success.workbenches.length).toBeGreaterThan(0);
            done();
        });
    });
});
xdescribe("AppContext::performLaunchAction", function () {
    it("should peform launch action successfully", function (done) {
        var launchAction = catavolt_2.AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
        catavolt_2.AppContext.singleton.performLaunchAction(launchAction).onComplete(function (navRequestTry) {
            catavolt_1.Log.debug("completed with: " + navRequestTry);
            if (navRequestTry.isFailure) {
                catavolt_1.Log.debug(navRequestTry.failure);
            }
            expect(navRequestTry.isSuccess).toBeTruthy();
            done();
        });
    });
});
//# sourceMappingURL=dialog.Test.js.map