import {BlobClientResponse} from "../client/BlobClientResponse";
import {Client} from "../client/Client";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io';
import {SdaDialogDelegate} from "../ppm/SdaDialogDelegate";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {DialogDelegate} from "./DialogDelegate";
import {DialogProxyTools} from './DialogProxyTools';

export class DialogProxy implements Client {

    private _dialogDelegateChain: DialogDelegate[];
    private _initialized: Promise<boolean>;
    private _lastActivity: Date = new Date();

    constructor() {
        this._dialogDelegateChain = [new SdaDialogDelegate()];
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> {
        return this.processRequestAndResponse('getBlob', 'handleGetBlobResponse', [baseUrl, resourcePath]);
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        return this.processRequestAndResponse('getText', 'handleGetTextResponse', [baseUrl, resourcePath]);
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> {
        return this.processRequestAndResponse('openStream', 'handleOpenStreamResponse', [baseUrl, resourcePath]);
    }

    public postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        return this.processRequestAndResponse('postMultipart', 'handlePostMultipartResponse', [baseUrl, resourcePath, formData]);
    }

    public getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        return this.processRequestAndResponse('getJson', 'handleGetJsonResponse', [baseUrl, resourcePath, queryParams]);
    }

    public postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this.processRequestAndResponse('postJson', 'handlePostJsonResponse', [baseUrl, resourcePath, jsonBody]);
    }

    public putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        return this.processRequestAndResponse('putJson', 'handlePutJsonResponse', [baseUrl, resourcePath, jsonBody]);
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        return this.processRequestAndResponse('deleteJson', 'handleDeleteJsonResponse', [baseUrl, resourcePath]);
    }

    private static delegateRequest(delegateIterator: Iterator<DialogDelegate>, requestFn: string, args): Promise<any> {
        const thisMethod = 'DialogProxy::delegateRequest';
        const nextDelegateItem = delegateIterator.next();
        if (nextDelegateItem.done) {
            Log.info(`${thisMethod} -- using common fetch client to process request: ${requestFn}`);
            const fc = DialogProxyTools.commonFetchClient();
            return fc[requestFn].apply(fc, args);
        }
        const nextDelegate = nextDelegateItem.value;
        const responsePr = nextDelegate[requestFn].apply(nextDelegate, args);
        if (!responsePr) {
            return this.delegateRequest(delegateIterator, requestFn, args);
        }
        return responsePr.then(response => {
            if (!response) {
                Log.info(`${thisMethod} -- delegate returned a falsey response, advancing to next delegate with request: ${requestFn}`);
                return this.delegateRequest(delegateIterator, requestFn, args);
            }
            return responsePr;
        });
    }

    private processRequestAndResponse(requestFn: string, responseFn: string, args): any {
        this.prepareForActivity();
        return this._initialized.then(() => {
            const delegateIterator = this._dialogDelegateChain[Symbol.iterator]();
            let responsePr = DialogProxy.delegateRequest(delegateIterator, requestFn, args);
            for (const d of this._dialogDelegateChain) {
                const argsWithResponse = args.slice(0);
                argsWithResponse.push(responsePr);
                responsePr = d[responseFn].apply(d, argsWithResponse);
            }
            return responsePr;
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
