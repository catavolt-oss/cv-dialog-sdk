/**
 * Created by rburson on 8/23/17.
 */
import {StringDictionary} from "../util";
import {Log} from "../util";

export interface Client {
    /*get(targetUrl:string):Future<StringDictionary>;*/
    post(url:string, body?:StringDictionary):Promise<JsonClientResponse>;
    /*postMultipart(targetUrl:string, formData:FormData):Future<void>;
    getWithRawResult(targetUrl:string):Future<string>;*/
}

type FetchMethod =  'GET' | 'POST' | 'PUT' | 'DELETE'

export class FetchClient {


    post(url:string, jsonBody?:StringDictionary):Promise<JsonClientResponse> {

        const headers = {'Accept':'application/json', 'Content-Type':'application/json;charset=UTF-8'};
        const body = jsonBody && JSON.stringify(jsonBody);
        return this.processRequest(url, body, 'POST', headers).then((response:Response)=>{
           return response.json().then(json=>new JsonClientResponse(json, response.status));
        });

    }

    private processRequest(url:string,
                           body:string,
                           method:FetchMethod,
                           headers:{[index: string]:string}):Promise<Response> {

        return new Promise((resolve, reject)=>{

            const requestHeaders:Headers = new Headers(headers);
            requestHeaders.append('Accept','gzip');
            const init:RequestInit = { method: method, mode: 'cors', headers: headers, body:body};

            if(!['GET', 'POST', 'PUT', 'DELETE'].some(v=>method === v)) {
                reject(new Error(`FetchClient::processRequest: Unsupported method: ${method}`))
            } else {
                fetch(url, init)
                    .then(response=>{
                        Log.debug(`FetchClient: succeeded with: ${response}`);
                        resolve(response);
                    })
                    .catch(error=>{
                        Log.debug(`FetchClient: failed with ${error}`)
                        reject(error);
                    });
            }
        });

    }

}

export abstract class ClientResponse<T> {

    constructor(readonly value:T,  readonly statusCode:number) {}

}

export class JsonClientResponse extends ClientResponse<StringDictionary> {

    constructor(value:StringDictionary, statusCode:number) {
        super(value, statusCode);
    }

}

class TextClientResponse extends ClientResponse<string> {

    constructor(value:string, statusCode:number) {
        super(value, statusCode);
    }

}

export class ClientFactory {
    static getClient():Client {
        return new FetchClient();
    }
}


