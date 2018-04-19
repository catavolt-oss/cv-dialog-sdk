import {BlobClientResponse} from "../client/BlobClientResponse";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io/StreamProducer';
import {DialogDelegate} from "../proxy/DialogDelegate";
import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {SessionState} from "../proxy/SessionState";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {SdaDialogDelegateState} from "./SdaDialogDelegateState";
import {SdaDialogDelegateTools} from "./SdaDialogDelegateTools";

export class SdaDialogDelegate implements DialogDelegate {

    private _delegateState: SdaDialogDelegateState = null;
    private _lastActivity: Date = new Date();

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public initialize(): Promise<void> {
        Log.info("SdaDialogDelegate::initialize -- nothing to initialize");
        return Promise.resolve();
    }

    public addWorkPackageToBriefcase(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        // REQUIRED: Before we can add a Work Package to the briefcase, we must be online
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Cannot add a Work Package to the briefcase while offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        Log.info("SdaDialogDelegate::addWorkpackageToBriefcase -- needs implementation: " + resourcePathElems);
        return null;
    }

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> | null {
        Log.info("SdaDialogDelegate::getBlob -- path: " + resourcePath);
        return null;
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> | null {
        Log.info("SdaDialogDelegate::getText -- path: " + resourcePath);
        return null;
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> | null {
        Log.info("SdaDialogDelegate::openStream -- path: " + resourcePath);
        return null;
    }

    public postMultipart<T>(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> | null {
        Log.info("SdaDialogDelegate::postMultipart -- path: " + resourcePath);
        return null;
    }

    public getJson(baseUrl: string, resourcePath: string, queryParams?: StringDictionary): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::getJson -- path: " + resourcePath);
        return null;
    }

    public postJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::postJson -- path: " + resourcePath);
        Log.info("SdaDialogDelegate::postJson -- body: " + JSON.stringify(body));
        const resourcePathElems: string[] = resourcePath.split('/');
        if (SdaDialogDelegateTools.isAddToBriefcaseMenuActionRequest(resourcePathElems)) {
            return this.addWorkPackageToBriefcase(baseUrl, resourcePathElems, body);
        }
        if (DialogProxyTools.isCreateSessionRequest(resourcePathElems)) {
            Log.info("SdaDialogDelegate::postJson -- CREATE SESSION");
        }
        return null;
    }

    public putJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::putJson -- path: " + resourcePath);
        Log.info("SdaDialogDelegate::putJson -- body: " + JSON.stringify(body));
        return null;
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::deleteJson -- path: " + resourcePath);
        return null;
    }

    public handleDeleteJsonResponse(baseUrl: string, resourcePath: string, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handleDeleteJsonResponse -- path: " + resourcePath);
        response.then(jcr => Log.info("SdaDialogDelegate::handleDeleteJsonResponse -- json response: " + JSON.stringify(jcr.value)));
        return response;
    }

    public handleGetBlobResponse(baseUrl: string, resourcePath: string, response: Promise<BlobClientResponse>): Promise<BlobClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetBlobResponse -- path: " + resourcePath);
        response.then(bcr => Log.info("SdaDialogDelegate::handleGetBlobResponse -- blob response: " + JSON.stringify(bcr.value)));
        return response;
    }

    public handleGetJsonResponse(baseUrl: string, resourcePath: string, queryParams: StringDictionary, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetJsonResponse -- path: " + resourcePath);
        response.then(jcr => Log.info("SdaDialogDelegate::handleGetJsonResponse -- json response: " + JSON.stringify(jcr.value)));
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                const jsonObject = jcr.value as StringDictionary;
                if (SdaDialogDelegateTools.isWorkPackagesRootDialog(jsonObject)) {
                    const resourcePathElems: string[] = resourcePath.split('/');
                    const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
                    const workPackagesDialog = SdaDialogDelegateTools.patchWorkPackagesDialog(jsonObject);
                    return new JsonClientResponse(workPackagesDialog, 200);
                }
            }
            return jcr;
        });
    }

    public handleGetTextResponse(baseUrl: string, resourcePath: string, response: Promise<TextClientResponse>): Promise<TextClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetTextResponse -- path: " + resourcePath);
        response.then(tcr => Log.info("SdaDialogDelegate::handleGetTextResponse -- text response: " + JSON.stringify(tcr.value)));
        return response;
    }

    public handleOpenStreamResponse(baseUrl: string, resourcePath: string, response: Promise<StreamProducer>): Promise<StreamProducer> | null {
        Log.info("SdaDialogDelegate::handleOpenStreamResponse -- path: " + resourcePath);
        response.then(sp => Log.info("SdaDialogDelegate::handleOpenStreamResponse -- stream producer response: " + sp));
        return response;
    }

    public handlePostJsonResponse(baseUrl: string, resourcePath: string, body: StringDictionary, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handlePostJsonResponse -- path: " + resourcePath);
        response.then(jcr => Log.info("SdaDialogDelegate::handlePostJsonResponse -- json response: " + JSON.stringify(jcr.value)));
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                const resourcePathElems: string[] = resourcePath.split('/');
                const jsonObject = jcr.value as StringDictionary;
                if (DialogProxyTools.isSessionRootDialog(jsonObject)) {
                    return this.initializeAfterCreateSession(resourcePathElems, new SessionState(jsonObject)).then(voidValue => jcr);
                } else if (SdaDialogDelegateTools.isWorkPackagesQueryRecordSet(resourcePathElems, jsonObject)) {
                    const patchedRecordSet = SdaDialogDelegateTools.patchWorkPackagesRecordSet(jsonObject, null);
                    Log.info('SdaDialogDelegate::handlePostJsonResponse -- PATCHED: ' + JSON.stringify(patchedRecordSet));
                    return new JsonClientResponse(patchedRecordSet, 200);
                }
            }
            return jcr;
        });
    }

    public handlePostMultipartResponse<T>(baseUrl: string, resourcePath: string, formData: FormData, response: Promise<VoidClientResponse>): Promise<VoidClientResponse> | null {
        Log.info("SdaDialogDelegate::handlePostMultipartResponse -- path: " + resourcePath);
        response.then(vcr => Log.info("SdaDialogDelegate::handlePostMultipartResponse -- void response: " + JSON.stringify(vcr.value)));
        return response;
    }

    public handlePutJsonResponse(baseUrl: string, resourcePath: string, body: StringDictionary, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handlePutJsonResponse -- path: " + resourcePath);
        return response;
    }

    private initializeAfterCreateSession(resourcePathElems: string[], sessionState: SessionState): Promise<void> {
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        return Promise.resolve().then(voidValue => {
            Log.info("SdaDialogDelegate::initialize -- showing storage keys");
            return SdaDialogDelegateTools.showAllStorageKeys();
        }).then(voidValue => {
            return SdaDialogDelegateTools.readDelegateState(pathFields.tenantId, sessionState.userId());
        }).then(delegateState => {
            Log.info(`SdaDialogDelegate::initialize -- current delegate state: ${delegateState.copyAsJsonString()}`)
            Log.info("SdaDialogDelegate::initialize -- SdaDialogDelegate is done initializing");
            delegateState.setUserId(sessionState.userId());
            return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, sessionState.userId(), delegateState).then(voidValue => {
                this._delegateState = delegateState;
                return SdaDialogDelegateTools.showAllStorageKeys().then(voidValue2 => {
                    return SdaDialogDelegateTools.readDelegateState(pathFields.tenantId, sessionState.userId());
                }).then(stateValue => {
                    Log.info('SdaDialogDelegate::initializeAfterCreateSession -- delegate state after write: ' + stateValue.copyAsJsonString());
                });
            });
        });
    }

    private online(): boolean {
        return this._delegateState.briefcaseRecordState().online();
    }

}
