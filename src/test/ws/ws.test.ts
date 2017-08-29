/**
 * Created by rburson on 8/25/17.
 */

import {Log, LogLevel} from '../../catavolt'

import * as test from "tape";

import {Client, FetchClient} from "../catavolt-test"

test("POST Test", (t) => {

    Log.logLevel(LogLevel.DEBUG);
    t.plan(1);
    const login = {userId:'***REMOVED***', password:'***REMOVED***', clientType:'DESKTOP', deviceProperties:{}}
    new FetchClient().post('https://dialog.hxgn-api.net/v0/tenants/***REMOVED***/sessions', login).then(
        jsonClientResponse=>{
            t.ok(jsonClientResponse);
        }
    ).catch(error=> {
       t.error(error);
    });

});