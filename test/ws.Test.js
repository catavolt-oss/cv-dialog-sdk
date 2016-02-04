/**
 * Created by rburson on 3/11/15.
 */
import { XMLHttpClient } from '../src/catavolt';
xdescribe("Request::XMLHttpClient", function () {
    it("Should get endpoint successfully", function (done) {
        var SERVICE_PATH = "https://www.catavolt.net/***REMOVED***/soi-json";
        var client = new XMLHttpClient();
        var f = client.jsonGet(SERVICE_PATH, 30000);
        f.onComplete((t) => {
            expect(t.isSuccess).toBe(true);
            var endPoint = t.success;
            expect(endPoint.responseType).toBe('soi-json');
            done();
        });
    });
});
/*describe("Request::XMLHttpClient", function () {

    it("Should login successfully", function (done) {

        var SERVICE_PATH = "http://www.catavolt.net/soi-json-v02/SessionService";
        var method = "createSessionDirectly";
        var params:StringDictionary = {
            tenantId: "***REMOVED***",
            userId: "sales",
            password: "***REMOVED***",
            clientType: "LIMITED_ACCESS"
        };

        var jsonObj:StringDictionary = {
            id: 1,
            method: method,
            params: params
        };

        var client:Client = new XMLHttpClient();
        client.jsonPost(SERVICE_PATH, jsonObj, 30000);
    });
});

describe("Request::Call", function () {
    var systemContext;

    beforeEach(function(){
        systemContext = new SystemContextImpl("http", "www.catavolt.net", null, null);
    });
    it("Should login successfully", function () {

        var SERVICE_PATH = "soi-json-v02/SessionService";
        var method = "createSessionDirectly";
        var params:StringDictionary = {
            tenantId: "***REMOVED***",
            userId: "sales",
            password: "***REMOVED***",
            clientType: "LIMITED_ACCESS"
        }
        var call:Call = Call.createCallWithoutSession(SERVICE_PATH, method, params, systemContext);
        call.perform();
    });
});*/
//# sourceMappingURL=ws.Test.js.map