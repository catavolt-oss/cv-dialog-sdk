/**
 * Created by rburson on 3/12/15.
 */
///<reference path="../references.ts"/>
/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
    This should be removed (and the commented section uncommented for production!!!
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GatewayService = (function () {
            function GatewayService() {
            }
            GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
                //We have to fake this for now, due to cross domain issues
                /*
                            var fakeResponse = {
                                responseType:"soi-json",
                                tenantId:"***REMOVED***z",
                                serverAssignment:"https://dfw.catavolt.net/vs301",
                                appVersion:"1.3.262",soiVersion:"v02"
                            }
                
                            var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);
                
                            */
                var f = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
                var endPointFuture = f.bind(function (jsonObject) {
                    //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                    return Future.createSuccessfulFuture("serviceEndpoint", jsonObject);
                });
                return endPointFuture;
            };
            return GatewayService;
        })();
        dialog.GatewayService = GatewayService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
