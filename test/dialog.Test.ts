/**
 * Created by rburson on 3/19/15.
 */

import {Log} from '../src/catavolt'
import {Try} from '../src/catavolt'
import {AppContext} from '../src/catavolt'
import {AppWinDef} from '../src/catavolt'
import {WorkbenchLaunchAction} from '../src/catavolt'
import {NavRequest} from '../src/catavolt'

var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";

xdescribe("AppContext::login", function () {
    it("should login successfully with valid creds", function (done) {
        AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(
            (appWinDefTry:Try<AppWinDef>)=> {
                Log.info(Log.formatRecString(appWinDefTry));
                Log.info(Log.formatRecString(AppContext.singleton.sessionContextTry));
                Log.info(Log.formatRecString(AppContext.singleton.tenantSettingsTry));
                expect(AppContext.singleton.appWinDefTry.success.workbenches.length).toBeGreaterThan(0);
                done();
            }
        );
    });
});

xdescribe("AppContext::performLaunchAction", function () {
    it("should peform launch action successfully", function (done) {
        var launchAction:WorkbenchLaunchAction = AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
        AppContext.singleton.performLaunchAction(launchAction).onComplete((navRequestTry:Try<NavRequest>)=> {
            Log.debug("completed with: " + navRequestTry);
            if (navRequestTry.isFailure) {
                Log.debug(navRequestTry.failure);
            }
            expect(navRequestTry.isSuccess).toBeTruthy();
            done();
        });
    });
});

