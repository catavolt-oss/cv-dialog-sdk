/**
 * Created by rburson on 8/23/17.
 */

import {StringDictionary, Log} from "./util";
import {JsonClientResponse, TextClientResponse, VoidClientResponse} from "./client"

type FetchMethod =  'GET' | 'POST' | 'PUT' | 'DELETE'

export class FetchClient {

    private _lastActivity:Date = new Date();

    get(baseUrl:string, resourcePath?:string):Promise<TextClientResponse> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'GET').then((response:Response)=>{
            return response.text().then(text=>new TextClientResponse(text, response.status));
        });
    }

    postMultipart(baseUrl:string, resourcePath:string, formData:FormData):Promise<VoidClientResponse> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'POST', formData).then((response:Response)=>{
            return new VoidClientResponse(response.status);
        });
    }


    getJson(baseUrl:string, resourcePath:string):Promise<JsonClientResponse> {

        const headers = {'Accept':'application/json'};
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'GET', null, headers).then((response:Response)=>{
            return this.assertJsonContentType(response.headers.get('content-type')).then(()=>{
                return response.json().then(json=>new JsonClientResponse(json, response.status));
            });
        });

    }

    get lastActivity():Date {
        return this._lastActivity;
    }

    postJson(baseUrl:string, resourcePath:string, jsonBody?:StringDictionary):Promise<JsonClientResponse> {

        const headers = {'Accept':'application/json', 'Content-Type':'application/json;charset=UTF-8'};
        const body = jsonBody && JSON.stringify(jsonBody);
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'POST', body, headers).then((response:Response)=>{
            return this.assertJsonContentType(response.headers.get('content-type')).then(()=>{
                return response.json().then(json=>new JsonClientResponse(json, response.status));
            });
        });

    }

    putJson(baseUrl:string, resourcePath:string, jsonBody?:StringDictionary):Promise<JsonClientResponse> {

        const headers = {'Accept':'application/json', 'Content-Type':'application/json;charset=UTF-8'};
        const body = jsonBody && JSON.stringify(jsonBody);
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'PUT', body, headers).then((response:Response)=>{
            return this.assertJsonContentType(response.headers.get('content-type')).then(()=>{
                return response.json().then(json=>new JsonClientResponse(json, response.status));
            });
        });

    }

    deleteJson(baseUrl:string, resourcePath:string):Promise<JsonClientResponse> {

        const headers = {'Accept':'application/json'};
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'DELETE', null, headers).then((response:Response)=>{
            return this.assertJsonContentType(response.headers.get('content-type')).then(()=>{
                return response.json().then(json=>new JsonClientResponse(json, response.status));
            });
        });

    }

    private assertJsonContentType(contentType:string):Promise<void> {
        return new Promise((resolve, reject)=>{
            if(this.isJsonContentType(contentType)) {
                resolve();
            } else {
                reject(new Error(`Expected 'application/json', got ${contentType}`))
            }
        });
    }

    private isJsonContentType(contentType:string):boolean {
        return contentType && contentType.includes('application/json');
    }

    private processRequest(url:string,
                           method:FetchMethod,
                           body?:any,
                           headers?:{[index: string]:string}):Promise<Response> {

        return new Promise((resolve, reject)=>{

            const requestHeaders:Headers = new Headers(headers);
            requestHeaders.append('Accept','gzip');
            const init:RequestInit = { method: method, mode: 'cors'};
            if(body) init.body = body;
            if(headers) init.headers = headers;

            if(!['GET', 'POST', 'PUT', 'DELETE'].some(v=>method === v)) {
                reject(new Error(`FetchClient::processRequest: Unsupported method: ${method}`))
            } else {
                Log.debug(`Fetch request: ${method} ${url} [body]:${body ? body : 'none'}`);
                fetch(url, init)
                    .then(response=>{this._lastActivity = new Date(); resolve(response)})
                    .catch(error=>{this._lastActivity = new Date(); reject(error)});
            }
        });

    }

}



