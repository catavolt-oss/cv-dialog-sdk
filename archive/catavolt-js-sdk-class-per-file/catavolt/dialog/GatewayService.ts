/**
 * Created by rburson on 3/12/15.
 */

import {Future} from "../fp/Future";
import {ServiceEndpoint} from "./ServiceEndpoint";
import {StringDictionary} from "../util/Types";
import {Get} from "../ws/Request";

/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
 This should be removed (and the commented section uncommented for production!!!
 */
export class GatewayService {

    static getServiceEndpoint(tenantId:string,
                              serviceName:string,
                              gatewayHost:string):Future<ServiceEndpoint> {


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

        var f:Future<StringDictionary> = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
        var endPointFuture:Future<ServiceEndpoint> = f.bind(
            (jsonObject:StringDictionary)=> {
                //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                return Future.createSuccessfulFuture<ServiceEndpoint>("serviceEndpoint", <any>jsonObject);
            }
        );

        return endPointFuture;
    }
}
