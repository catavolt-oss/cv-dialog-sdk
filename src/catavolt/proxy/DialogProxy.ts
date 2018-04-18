import {BlobClientResponse, Client, JsonClientResponse, TextClientResponse, VoidClientResponse} from '../client';
import {StreamProducer} from '../io';
import {SdaDialogDelegate} from "../ppm";
import {Log, StringDictionary} from '../util';
import {DialogDelegate} from "./DialogDelegate";
import {DialogProxyTools} from './DialogProxyTools';

export class DialogProxy implements Client {

    private _dialogDelegateChain: DialogDelegate[];
    private _lastActivity: Date = new Date();
    private _initialized: Promise<boolean>;

    constructor() {
        this._dialogDelegateChain = [new SdaDialogDelegate()];
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<BlobClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.getBlob(baseUrl, resourcePath);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().getBlob(baseUrl, resourcePath);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handleGetBlobResponse(baseUrl, resourcePath, response);
            }
            return response;
        });
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<TextClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.getText(baseUrl, resourcePath);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().getText(baseUrl, resourcePath);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handleGetTextResponse(baseUrl, resourcePath, response);
            }
            return response;
        });
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<StreamProducer>;
            for (const d of this._dialogDelegateChain) {
                response = d.openStream(baseUrl, resourcePath);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().openStream(baseUrl, resourcePath);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handleOpenStreamResponse(baseUrl, resourcePath, response);
            }
            return response;
        });
    }

    public postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<VoidClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.postMultipart(baseUrl, resourcePath, formData);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().postMultipart(baseUrl, resourcePath, formData);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handlePostMultipartResponse(baseUrl, resourcePath, formData, response);
            }
            return response;
        });
    }

    public getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<JsonClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.getJson(baseUrl, resourcePath, queryParams);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath, queryParams);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handleGetJsonResponse(baseUrl, resourcePath, queryParams, response);
            }
            return response;
        });
    }

    public postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<JsonClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.postJson(baseUrl, resourcePath, jsonBody);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().postJson(baseUrl, resourcePath, jsonBody);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handlePostJsonResponse(baseUrl, resourcePath, jsonBody, response);
            }
            return response;
        });
    }

    public putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let reponse: Promise<JsonClientResponse>;
            for (const d of this._dialogDelegateChain) {
                reponse = d.putJson(baseUrl, resourcePath, jsonBody);
                if (reponse !== null) {
                    break;
                }
            }
            if (!reponse) {
                reponse = DialogProxyTools.commonFetchClient().putJson(baseUrl, resourcePath, jsonBody);
            }
            for (const d of this._dialogDelegateChain) {
                reponse = d.handlePutJsonResponse(baseUrl, resourcePath, jsonBody, reponse);
            }
            return reponse;
        });
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        this.prepareForActivity();
        return this._initialized.then(() => {
            let response: Promise<JsonClientResponse>;
            for (const d of this._dialogDelegateChain) {
                response = d.deleteJson(baseUrl, resourcePath);
                if (response !== null) {
                    break;
                }
            }
            if (!response) {
                response = DialogProxyTools.commonFetchClient().deleteJson(baseUrl, resourcePath);
            }
            for (const d of this._dialogDelegateChain) {
                response = d.handleDeleteJsonResponse(baseUrl, resourcePath, response);
            }
            return response;
        });
    }

    private prepareForActivity() {
        this._lastActivity = new Date();
        if (!this._initialized) {
            Log.info("DialogProxy::prepareForActivity -- waiting for all DialogDelegates to initialize");
            const allDelegatesInitializing = this._dialogDelegateChain.map(d => d.initialize());
            this._initialized = Promise.all(allDelegatesInitializing).then(() => {
                Log.info("DialogProxy::prepareForActivity -- all DialogDelegates are initialized");
                Log.info("DialogProxy::prepareForActivity -- DialogProxy is initialized");
                return true;
            });
        }
    }

}
