/**
 * Created by rburson on 9/1/17.
 */

import * as test from "tape";

import {AppContext, Redirection, DialogRedirectionTypeName, Session, Workbench, WorkbenchAction, Log} from "../catavolt-test";

let [tenantId, userId, password, sessionId, workbenchId, workbenchLaunchId] =
    ['***REMOVED***', 'glenn', 'glenn5288', null, 'AAABACffAAAAF91p', 'AAABACfaAAAAAa5z'];
//  ['***REMOVED***', 'rburson', '***REMOVED***', null];

let workbenchDefs:Array<Workbench> = null;
let redirection:Redirection = null;

test("Invalid Login Test", (t) => {

    t.plan(1);

    AppContext.singleton.login(tenantId, 'DESKTOP', userId, 'not a valid password').catch((e:Error)=>{
        t.assert(e);
    });

});

test("Login Test", (t) => {

    t.plan(2);

    AppContext.singleton.login(tenantId, 'DESKTOP', userId, password).then(session=>{
        t.ok(session);
        t.ok((session as Session).id)
    })
});

/*test("Workbench Test", (t) => {

    t.plan(1);

    AppContext.singleton.getWorkbenches().then(workbenches=>{
        t.ok(workbenches && workbenches.length > 0);
        workbenchDefs = workbenches;
        workbenches.forEach(workbench=>Log.debug(workbench));
    })


});*/

test("Launch Workbench Test", (t) => {

    t.plan(1);
    AppContext.singleton.performLaunchActionForId(workbenchId, workbenchLaunchId)
        .then((successOrRedir:{actionId:string} | Redirection)=>{
            t.ok(successOrRedir);
            if((successOrRedir as Redirection).type === DialogRedirectionTypeName) {
                Log.debug(successOrRedir);
                redirection = successOrRedir as Redirection;
            } else {
                Log.debug(`Got a ${Log.formatRecString(successOrRedir)}`)
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

test("Open Redirection Test", (t) => {

    t.plan(1);
    AppContext.singleton.openRedirection(redirection).then(result=>{
        t.ok(result);
        Log.debug('Got ' + result)
    });

});
//
// test("Logout Test", (t) => {
//
//     t.plan(3);
//
//     AppContext.singleton.logout().then((response:{sessionId:string})=>{
//         t.ok(response);
//         t.ok(response.sessionId);
//         t.equal(sessionId, response.sessionId)
//     })
// });

