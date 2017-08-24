/**
 * Created by rburson on 8/23/17.
 */
//import {StringDictionary} from "../util";
//import {Log} from "../util";

export interface Client {
    /*get(targetUrl:string, timeoutMillis?:number):Future<StringDictionary>;
    post(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary>;
    postMultipart(targetUrl:string, formData:FormData):Future<void>;
    getWithRawResult(targetUrl:string, timeoutMillis?:number):Future<string>;*/
}

export class FetchClient {

    private processRequest(url:string, body:string, method:string, timeoutMillis:number = 30000):Promise<Response> {

        return new Promise((resolve, reject)=>{

            const init:RequestInit = { method: method, mode: "cors" }

            if(!['GET', 'POST', 'PUT', 'DELETE'].some(v=>method === v)) {
               //report unsupported method
            }

            fetch(url, init).then(response=>{

            }).catch(error=>{

            });


        });

    }

}

export class ClientFactory {
    static getClient():Client {
        return new FetchClient();
    }
}


interface Response {

}
