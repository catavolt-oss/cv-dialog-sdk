import {BlobClientResponse, Client, JsonClientResponse, TextClientResponse, VoidClientResponse} from '../client';
import {StreamProducer} from '../io';
import {SdaDialogDelegate} from "../ppm";
import {StringDictionary} from '../util';
import {DialogProxyTools} from './DialogProxyTools';

export class DialogProxy implements Client {

    private _dialogDelegateChain: Client[];

    /* Last operation happened at this time */
    private _lastActivity: Date = new Date();

    constructor() {
        this._dialogDelegateChain = [new SdaDialogDelegate()];
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.getBlob(baseUrl, resourcePath);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().getBlob(baseUrl, resourcePath);
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.getText(baseUrl, resourcePath);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().getText(baseUrl, resourcePath);
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.openStream(baseUrl, resourcePath);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().openStream(baseUrl, resourcePath);
    }

    public postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.postMultipart(baseUrl, resourcePath, formData);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().postMultipart(baseUrl, resourcePath, formData);
    }

    public getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.getJson(baseUrl, resourcePath, queryParams);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath, queryParams);
    }

    public postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.postJson(baseUrl, resourcePath, jsonBody);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, jsonBody);
    }

    public putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.putJson(baseUrl, resourcePath, jsonBody);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().putJson(baseUrl, resourcePath, jsonBody);
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        for (const c of this._dialogDelegateChain) {
            const answer = c.deleteJson(baseUrl, resourcePath);
            if (answer !== null) {
                return answer;
            }
        }
        return DialogProxyTools.commonFetchClient().deleteJson(baseUrl, resourcePath);
    }

}
