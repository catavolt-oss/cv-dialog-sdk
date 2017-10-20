"use strict";
/**
 * Created by rburson on 9/1/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test = require("tape");
var catavolt_test_1 = require("../catavolt-test");
var _a = ['***REMOVED***', 'glenn', 'glenn5288', null, 'AAABACffAAAAF91p', 'AAABACfaAAAAAa5z'], tenantId = _a[0], userId = _a[1], password = _a[2], sessionId = _a[3], workbenchId = _a[4], workbenchLaunchId = _a[5];
//  ['***REMOVED***', 'rburson', '***REMOVED***', null];
var workbenchDefs = null;
var redirection = null;
test("Invalid Login Test", function (t) {
    t.plan(1);
    catavolt_test_1.AppContext.singleton.login(tenantId, 'DESKTOP', userId, 'not a valid password').catch(function (e) {
        t.assert(e);
    });
});
test("Login Test", function (t) {
    t.plan(2);
    catavolt_test_1.AppContext.singleton.login(tenantId, 'DESKTOP', userId, password).then(function (session) {
        t.ok(session);
        t.ok(session.id);
        sessionId = session.id;
    });
});
/*test("Workbench Test", (t) => {

    t.plan(1);

    AppContext.singleton.getWorkbenches().then(workbenches=>{
        t.ok(workbenches && workbenches.length > 0);
        workbenchDefs = workbenches;
        workbenches.forEach(workbench=>Log.debug(workbench));
    })


});*/
test("Launch Workbench Test", function (t) {
    t.plan(1);
    catavolt_test_1.AppContext.singleton.performLaunchActionForId(workbenchId, workbenchLaunchId)
        .then(function (successOrRedir) {
        t.ok(successOrRedir);
        if (successOrRedir.redirectionType) {
            catavolt_test_1.Log.debug(successOrRedir);
            redirection = successOrRedir;
        }
        else {
            catavolt_test_1.Log.debug("Got a " + catavolt_test_1.Log.formatRecString(successOrRedir));
        }
    });
    /*t.plan(1);
    AppContext.singleton.performLaunchAction(workbenchDefs[0], workbenchDefs[0].actions[0])
        .then((successOrRedir:{actionId:string} | Redirection)=>{
            if((successOrRedir as Redirection).redirectionType) {
               Log.debug(successOrRedir);
            } else {
                Log.debug(`Got a ${Log.formatRecString(successOrRedir)}`)
            }
     });*/
});
test("Open Redirection Test", function (t) {
    t.plan(1);
    catavolt_test_1.AppContext.singleton.openRedirection(redirection).then(function (result) {
        t.ok(result);
        catavolt_test_1.Log.debug('Got ' + catavolt_test_1.Log.formatRecString(result));
    });
});
test("Logout Test", function (t) {
    t.plan(3);
    catavolt_test_1.AppContext.singleton.logout().then(function (response) {
        t.ok(response);
        t.ok(response.sessionId);
        t.equal(sessionId, response.sessionId);
    });
});
