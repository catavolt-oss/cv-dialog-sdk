"use strict";
/**
 * Created by rburson on 8/25/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var catavolt_1 = require("../../catavolt");
var test = require("tape");
var catavolt_test_1 = require("../catavolt-test");
test("POST Test", function (t) {
    catavolt_1.Log.logLevel(catavolt_1.LogLevel.DEBUG);
    t.plan(1);
    var login = { userId: '***REMOVED***', password: '***REMOVED***', clientType: 'DESKTOP', deviceProperties: {} };
    new catavolt_test_1.FetchClient().post('https://dialog.hxgn-api.net/v0/tenants/***REMOVED***/sessions', login).then(function (jsonClientResponse) {
        t.ok(jsonClientResponse);
    }).catch(function (error) {
        t.error(error);
    });
});
