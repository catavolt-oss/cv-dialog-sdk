/**
 * Created by rburson on 3/12/15.
 */

///<reference path="../fp/references.ts"/>
///<reference path="../ws/references.ts"/>
///<reference path="../util/references.ts"/>

module catavolt.dialog {

    export class GatewayService {

        static getServiceEndpoint(tenantId:string,
                                  serviceName:string,
                                  gatewayHost:string):Future<ServiceEndpoint> {


            var f:Future<StringDictionary> = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
            var endPointFuture:Future<ServiceEndpoint> = f.bind(
                (jsonObject:StringDictionary)=>{
                    //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                    return Future.createSuccessfulFuture<ServiceEndpoint>("serviceEndpoint", <any>jsonObject);
                }
            );

            return endPointFuture;
        }
    }
}
