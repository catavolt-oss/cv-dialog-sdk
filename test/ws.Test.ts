/**
 * Created by rburson on 3/11/15.
 */

///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.ws {

    describe("Request::XMLHttpClient", function () {

        it("Should get endpoint successfully", function (done) {

            var SERVICE_PATH = "https://www.catavolt.net/***REMOVED***/soi-json";
            var client:Client = new XMLHttpClient();
            client.jsonGet(SERVICE_PATH, 30000);
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

}
