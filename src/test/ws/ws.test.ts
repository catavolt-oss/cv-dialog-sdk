/**
 * Created by rburson on 8/25/17.
 */

import * as test from "tape";

import {Client, FetchClient} from "../catavolt-test"

/* tslint:disable */

let [tenantId, userId, password, baseUrl, sessionId] =
    ['', '', '', 'https://dialog.hxgn-api.net/v0', null];

test("POST Test", (t) => {

    t.plan(3);
    const login = {userId, password, clientType:'DESKTOP', deviceProperties:{}};
    new FetchClient().postJson(baseUrl, `tenants/${tenantId}/sessions`, login).then(
        jsonClientResponse=>{
            t.ok(jsonClientResponse);
            t.equal(jsonClientResponse.statusCode, 200);
            t.ok(jsonClientResponse.value['id']);
            sessionId = jsonClientResponse.value['id'];
        }
    ).catch(error=> {
       t.error(error);
    });

});

test("GET Test", (t) => {

    t.plan(4);
    new FetchClient().getJson(baseUrl, `tenants/${tenantId}/sessions/${sessionId}`).then(
        jsonClientResponse=>{
            t.ok(jsonClientResponse);
            t.equal(jsonClientResponse.statusCode, 200);
            t.ok(jsonClientResponse.value['id']);
            t.equal(sessionId, jsonClientResponse.value['id']);
        }
    ).catch(error=> {
        t.error(error);
    });

});

test("DELETE Test", (t) => {

    t.plan(2);
    new FetchClient().deleteJson(baseUrl, `tenants/${tenantId}/sessions/${sessionId}`).then(
        jsonClientResponse=>{
            t.ok(jsonClientResponse);
            t.equal(jsonClientResponse.statusCode, 200);
        }
    ).catch(error=> {
        t.error(error);
    });

});
