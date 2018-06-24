import {BlobClientResponse} from "../client/BlobClientResponse";
import {Client} from "../client/Client";
import {ClientListener} from "../client/ClientListener";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io/StreamProducer';
import {SdaDialogDelegate} from "../ppm/SdaDialogDelegate";
import {CvLocale} from "../util";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {DialogDelegate} from "./DialogDelegate";
import {DialogProxyTools} from './DialogProxyTools';
import {DialogRequest} from "./DialogRequest";
import {ValueIterator} from "./ValueIterator";

export class DialogProxy implements Client {

    private _clientListener: ClientListener;
    private _dialogDelegateChain: DialogDelegate[];
    private _initialized: boolean;
    private _initializedPr: Promise<boolean>;
    private _initializedRejectFn: (error) => void;
    private _initializedResolveFn: (value) => void;
    private _lastActivity: Date = new Date();
    private _locale: CvLocale;

    constructor() {
        this._initialized = false;
        this._initializedPr = new Promise((resolve, reject) => {
            this._initializedResolveFn = resolve;
            this._initializedRejectFn = reject;
        });
        this._dialogDelegateChain = [new SdaDialogDelegate()];
    }

    public clientListener() {
        return this._clientListener;
    }

    // TODO: Shouldn't CvLocale either be a property of the Client or the Listener, not an extra parameter?
    public addClientListener(clientListener: ClientListener, locale: CvLocale) {
        this._clientListener = clientListener;
        this._locale = locale;
    }

    public removeClientListener(clientListener: ClientListener) {
        this._clientListener = null;
    }

    get lastActivity(): Date {
        return this._lastActivity;
    }

    // @TODO - implement this
    get isOffline():boolean {
        return false;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> {
        const dialogRequest = DialogRequest.createFromGetRequest(baseUrl, resourcePath, null);
        return this.processRequestAndResponse('getBlob', 'handleGetBlobResponse', [dialogRequest]);
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> {
        const dialogRequest = DialogRequest.createFromGetRequest(baseUrl, resourcePath, null);
        return this.processRequestAndResponse('getText', 'handleGetTextResponse', [dialogRequest]);
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> {
        const dialogRequest = DialogRequest.createFromGetRequest(baseUrl, resourcePath, null);
        return this.processRequestAndResponse('openStream', 'handleOpenStreamResponse', [dialogRequest]);
    }

    public postMultipart(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> {
        const dialogRequest = DialogRequest.createFromPostMultipartRequest(baseUrl, resourcePath, formData);
        return this.processRequestAndResponse('postMultipart', 'handlePostMultipartResponse', [dialogRequest]);
    }

    public getJson(baseUrl: string, resourcePath?: string, queryParams?: StringDictionary): Promise<JsonClientResponse> {
        const dialogRequest = DialogRequest.createFromGetRequest(baseUrl, resourcePath, queryParams);
        return this.processRequestAndResponse('getJson', 'handleGetJsonResponse', [dialogRequest]);
    }

    public postJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const dialogRequest = DialogRequest.createFromPostRequest(baseUrl, resourcePath, jsonBody);
        return this.processRequestAndResponse('postJson', 'handlePostJsonResponse', [dialogRequest]);
    }

    public putJson(baseUrl: string, resourcePath: string, jsonBody?: StringDictionary): Promise<JsonClientResponse> {
        const dialogRequest = DialogRequest.createFromPutRequest(baseUrl, resourcePath, jsonBody);
        return this.processRequestAndResponse('putJson', 'handlePutJsonResponse', [dialogRequest]);
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> {
        const dialogRequest = DialogRequest.createFromDeleteRequest(baseUrl, resourcePath);
        return this.processRequestAndResponse('deleteJson', 'handleDeleteJsonResponse', [dialogRequest]);
    }

    private static async delegateRequest(previousPr: Promise<any>, delegateIterator: ValueIterator<DialogDelegate>, requestFn: string, args): Promise<any> {
        const thisMethod = 'DialogProxy::delegateRequest';
        await previousPr;
        if (delegateIterator.done()) {
            Log.info(`${thisMethod} -- using common fetch client to process request: ${requestFn}`);
            const fetchClient = DialogProxyTools.commonFetchClient();
            const fetchClientParams = (args[0] as DialogRequest).fetchClientParams();
            return fetchClient[requestFn].apply(fetchClient, fetchClientParams);
        }
        // Select next delegate
        const nextDelegate = delegateIterator.next();
        const nextPr = nextDelegate[requestFn].apply(nextDelegate, args);
        if (!nextPr) {
            // Next delegate chose to immediately skip this request, so advance to the next delegate
            return this.delegateRequest(previousPr, delegateIterator, requestFn, args);
        }
        const response = await nextPr;
        if (!response) {
            // Next delegate chose to skip this request after a delay, so advance to the next delegate
            Log.info(`${thisMethod} -- delegate returned a falsey response, advancing to the next delegate with request: ${requestFn}`);
            return this.delegateRequest(nextPr, delegateIterator, requestFn, args);
        }
        // Next delegate produced a response, so this is the future that will be processed
        return nextPr;
    }

    private async prepareForActivity(): Promise<boolean> {
        if (!this._initialized) {
            Log.info("DialogProxy::prepareForActivity -- waiting for all DialogDelegates to initialize");
            const allDelegatesInitializing = this._dialogDelegateChain.map(d => d.initialize(this));
            await Promise.all(allDelegatesInitializing);
            this._initialized = true;
            Log.info("DialogProxy::prepareForActivity -- all DialogDelegates are initialized");
            Log.info("DialogProxy::prepareForActivity -- DialogProxy is initialized");
            this._initializedResolveFn(this._initialized);
        }
        this._lastActivity = new Date();
        return this._initializedPr;
    }

    private async processRequestAndResponse(requestFn: string, responseFn: string, args): Promise<any> {
        await this.prepareForActivity();
        const delegateIterator = new ValueIterator(this._dialogDelegateChain);
        let responsePr = DialogProxy.delegateRequest(Promise.resolve(), delegateIterator, requestFn, args);
        for (const d of this._dialogDelegateChain) {
            const argsWithResponse = args.slice(0);
            argsWithResponse.push(responsePr);
            responsePr = d[responseFn].apply(d, argsWithResponse);
        }
        return responsePr;
    }

}
