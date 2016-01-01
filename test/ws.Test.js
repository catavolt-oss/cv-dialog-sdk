/**
 * Created by rburson on 3/11/15.
 */
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var ws;
    (function (ws) {
        xdescribe("Request::XMLHttpClient", function () {
            it("Should get endpoint successfully", function (done) {
                var SERVICE_PATH = "https://www.catavolt.net/***REMOVED***/soi-json";
                var client = new XMLHttpClient();
                var f = client.jsonGet(SERVICE_PATH, 30000);
                f.onComplete(function (t) {
                    expect(t.isSuccess).toBe(true);
                    var endPoint = t.success;
                    expect(endPoint.responseType).toBe('soi-json');
                    done();
                });
            });
        });
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
