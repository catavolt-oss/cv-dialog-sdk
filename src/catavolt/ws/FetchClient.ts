import { BlobClientResponse } from '../client/BlobClientResponse';
import { Client } from '../client/Client';
import {ClientListener} from "../client/ClientListener";
import { JsonClientResponse } from '../client/JsonClientResponse';
import { ReadableStreamClientResponse } from '../client/StreamingClientResponse';
import { TextClientResponse } from '../client/TextClientResponse';
import { VoidClientResponse } from '../client/VoidClientResponse';
import { StreamProducer } from '../io/StreamProducer';
import {CvLocale, Log, StringDictionary} from '../util';

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class FetchClient implements Client {
    private _lastActivity: Date = new Date();
    private _locale:CvLocale;
    private _clientListener:ClientListener;

    public addClientListener(clientListener: ClientListener, locale:CvLocale) {
       this._clientListener = clientListener;
       this._locale = locale;
    }

    public removeClientListener(clientListener: ClientListener) {
        this._clientListener = null;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'GET').then((response: Response) => {
            return response.blob().then(blob => new BlobClientResponse(blob, response.status));
        });
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'GET').then((response: Response) => {
            return response.text().then(text => new TextClientResponse(text, response.status));
        });
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'GET').then((response: Response) => {
            return Promise.resolve(new ReadableStreamClientResponse(response.body, response.status));
        });
    }

    public postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'POST', formData).then((response: Response) => {
            return new VoidClientResponse(response.status);
        });
    }

    public getJson(
        baseUrl: string,
        resourcePath?: string,
        queryParams?: StringDictionary
    ): Promise<JsonClientResponse> {
        const headers = { Accept: 'application/json' };
        const queryString = this.encodeQueryParams(queryParams);
        const url = resourcePath ? `${baseUrl}/${resourcePath}${queryString}` : `${baseUrl}${queryString}`;
        return this.processRequest(url, 'GET', null, headers).then((response: Response) => {
            return this.assertJsonContentType(response.headers.get('content-type')).then(() => {
                return response.json().then(json => new JsonClientResponse(json, response.status));
            });
        });
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        };
        const body = jsonBody && JSON.stringify(jsonBody);
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'POST', body, headers).then((response: Response) => {
            return this.assertJsonContentType(response.headers.get('content-type')).then(() => {
                return response.json().then(json => new JsonClientResponse(json, response.status));
            });
        });
    }

    public putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        };
        const body = jsonBody && JSON.stringify(jsonBody);
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'PUT', body, headers).then((response: Response) => {
            return this.assertJsonContentType(response.headers.get('content-type')).then(() => {
                return response.json().then(json => new JsonClientResponse(json, response.status));
            });
        });
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        const headers = { Accept: 'application/json' };
        const url = resourcePath ? `${baseUrl}/${resourcePath}` : baseUrl;
        return this.processRequest(url, 'DELETE', null, headers).then((response: Response) => {
            return this.assertJsonContentType(response.headers.get('content-type')).then(() => {
                return response.json().then(json => new JsonClientResponse(json, response.status));
            });
        });
    }

    public fetch(
        url: string,
        method: FetchMethod,
        body?: any,
        headers?: { [index: string]: string },
        fetchOpts?: {}
    ): Promise<Response> {
        return this.processRequest(url, method, body, headers, fetchOpts);
    }

    private assertJsonContentType(contentType: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isJsonContentType(contentType)) {
                resolve();
            } else {
                reject(new Error(`Expected 'application/json', got ${contentType}`));
            }
        });
    }

    private encodeQueryParams(queryParams: StringDictionary): string {
        let result = '';
        if (queryParams) {
            for (const name in queryParams) {
                if (queryParams.hasOwnProperty(name)) {
                    result += `${encodeURIComponent(name)}=${encodeURIComponent(queryParams[name])}&`;
                }
            }
        }

        return result.length > 0 ? `?${result.slice(0, -1)}` : result;
    }

    private isJsonContentType(contentType: string): boolean {
        return contentType && contentType.includes('application/json');
    }

    private processRequest(
        url: string,
        method: FetchMethod,
        body?: any,
        headers?: { [index: string]: string },
        fetchOpts?: {}
    ): Promise<Response> {
        return new Promise((resolve, reject) => {
            const requestHeaders: Headers = new Headers(headers);
            const init: RequestInit = { method, mode: 'cors' };
            if (body) {
                init.body = body;
            }
            if (headers) {
                init.headers = new Headers(headers);
            }
            if (fetchOpts) {
                Object.assign(init, fetchOpts);
            }

            if (!['GET', 'POST', 'PUT', 'DELETE'].some(v => method === v)) {
                reject(new Error(`FetchClient::processRequest: Unsupported method: ${method}`));
            } else {
                Log.debug(`Fetch request: ${method} ${url} [body]:${body ? body : 'none'}`);
                fetch(url, init)
                    .then(response => {
                        this._lastActivity = new Date();
                        resolve(response);
                    })
                    .catch(error => {
                        this._lastActivity = new Date();
                        reject(error);
                    });
            }
        });
    }
}
