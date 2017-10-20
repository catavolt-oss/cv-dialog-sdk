"use strict";
/**
 * Created by rburson on 8/25/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test = require("tape");
var catavolt_test_1 = require("../catavolt-test");
var _a = ['***REMOVED***', 'rburson', '***REMOVED***', 'https://dialog.hxgn-api.net/v0', null], tenantId = _a[0], userId = _a[1], password = _a[2], baseUrl = _a[3], sessionId = _a[4];
test("POST Test", function (t) {
    t.plan(3);
    var login = { userId: userId, password: password, clientType: 'DESKTOP', deviceProperties: {} };
    new catavolt_test_1.FetchClient().postJson(baseUrl, "tenants/" + tenantId + "/sessions", login).then(function (jsonClientResponse) {
        t.ok(jsonClientResponse);
        t.equal(jsonClientResponse.statusCode, 200);
        t.ok(jsonClientResponse.value['id']);
        sessionId = jsonClientResponse.value['id'];
    }).catch(function (error) {
        t.error(error);
    });
});
test("GET Test", function (t) {
    t.plan(4);
    new catavolt_test_1.FetchClient().getJson(baseUrl, "tenants/" + tenantId + "/sessions/" + sessionId).then(function (jsonClientResponse) {
        t.ok(jsonClientResponse);
        t.equal(jsonClientResponse.statusCode, 200);
        t.ok(jsonClientResponse.value['id']);
        t.equal(sessionId, jsonClientResponse.value['id']);
    }).catch(function (error) {
        t.error(error);
    });
});
test("DELETE Test", function (t) {
    t.plan(2);
    new catavolt_test_1.FetchClient().deleteJson(baseUrl, "tenants/" + tenantId + "/sessions/" + sessionId).then(function (jsonClientResponse) {
        t.ok(jsonClientResponse);
        t.equal(jsonClientResponse.statusCode, 200);
    }).catch(function (error) {
        t.error(error);
    });
});
