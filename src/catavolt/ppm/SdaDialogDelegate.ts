import {BlobClientResponse} from "../client/BlobClientResponse";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io/StreamProducer';
import {ActionParametersVisitor} from "../proxy/ActionParametersVisitor";
import {DialogDelegate} from "../proxy/DialogDelegate";
import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {DialogRedirectionVisitor} from "../proxy/DialogRedirectionVisitor";
import {DialogVisitor} from "../proxy/DialogVisitor";
import {LoginVisitor} from "../proxy/LoginVisitor";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {SessionVisitor} from "../proxy/SessionVisitor";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {SdaGetBriefcaseDialogJsonSample} from "./samples/SdaGetBriefcaseDialogJsonSample";
import {SdaPostBriefcaseWorkbenchActionJsonSample} from "./samples/SdaPostBriefcaseWorkbenchActionJsonSample";
import {SdaDialogDelegateState} from "./SdaDialogDelegateState";
import {SdaDialogDelegateTools} from "./SdaDialogDelegateTools";
import {SelectedWorkPackageVisitor} from "./SelectedWorkPackageVisitor";
import {WorkPackagesRecordSetVisitor} from "./WorkPackagesRecordSetVisitor";

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

    // --- Request Handlers --- //

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
        const thisMethod = 'SdaDialogDelegate::getJson';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (DialogProxyTools.isGetDialog(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
            if (SdaDialogDelegateTools.isOfflineBriefcaseDialogId(pathFields.dialogId)) {
                const response = SdaGetBriefcaseDialogJsonSample.copyOfResponse();
                DialogVisitor.propagateTenantIdAndSessionId(response, pathFields.tenantId, pathFields.sessionId);
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        } else if (DialogProxyTools.isGetRecord(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructGetRecordPath(resourcePathElems);
            if (SdaDialogDelegateTools.isOfflineBriefcaseDetailsDialogId(pathFields.dialogId)) {
                const response = this._delegateState.visitBriefcase().enclosedJsonObject();
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        }
        return null;
    }

    public postJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::postJson';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        Log.info(`${thisMethod} -- body: ${JSON.stringify(body)}`);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (SdaDialogDelegateTools.isAddToBriefcaseMenuActionRequest(resourcePathElems)) {
            return this.performAddWorkPackageToBriefcase(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isRemoveFromBriefcaseMenuActionRequest(resourcePathElems)) {
            return this.performRemoveWorkPackageFromBriefcase(baseUrl, resourcePathElems, body);
        } else if (DialogProxyTools.isCreateSessionRequest(resourcePathElems)) {
            return this.performCreateSessionRequest(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isBriefcaseWorkbenchActionRequest(resourcePathElems)) {
            return this.performBriefcaseWorkbenchActionRequest(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isOfflineBriefcaseWorkPackagesRequest(resourcePathElems)) {
            return this.performOfflineBriefcaseWorkPackagesRequest(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isOfflineBriefcaseCommentsRequest(resourcePathElems)) {
            return this.performOfflineBriefcaseCommentsRequest(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isEnterOfflineModeMenuActionRequest(resourcePathElems)) {
            return this.performEnterOfflineModeMenuActionRequest(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isExitOfflineModeMenuActionRequest(resourcePathElems)) {
            return this.performExitOfflineModeMenuActionRequest(baseUrl, resourcePathElems, body);
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

    // --- Response Handlers --- //

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
                    const workPackagesDialog = SdaDialogDelegateTools.insertBriefcaseMetaDataIntoWorkPackagesDialog(jsonObject);
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
        const thisMethod = 'SdaDialogDelegate::handlePostJsonResponse';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        response.then(jcr => Log.info(`${thisMethod} -- json response: ${JSON.stringify(jcr.value)}`));
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                const resourcePathElems: string[] = resourcePath.split('/');
                const jsonObject = jcr.value as StringDictionary;
                if (DialogProxyTools.isSessionObject(jsonObject)) {
                    return this.initializeAfterCreateSession(resourcePathElems, new SessionVisitor(jsonObject)).then(voidValue => jcr);
                } else if (SdaDialogDelegateTools.isWorkPackagesQueryRecordSet(resourcePathElems, jsonObject)) {
                    const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
                    const workPackagesRecordSetVisitor = new WorkPackagesRecordSetVisitor(jsonObject);
                    workPackagesRecordSetVisitor.updateBriefcaseColumnUsingSelections(this._delegateState.selectedWorkPackageIds());
                    this._delegateState.visitWorkPackagesRecordSet().addOrUpdateAllRecords(workPackagesRecordSetVisitor);
                    return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, this._delegateState).then(voidValue => {
                        return new JsonClientResponse(workPackagesRecordSetVisitor.enclosedJsonObject(), 200);
                    });
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

    // --- Others --- //

    private captureOfflineSession(baseUrl:string, tenantId: string, sessionId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineSession';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}`;
        const sessionPr = DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath);
        return sessionPr.then(sessionJcr => {
            Log.info(`${thisMethod} -- session value: ${JSON.stringify(sessionJcr.value)}`);
            const sessionVisitor = new SessionVisitor(sessionJcr.value);
            return SdaDialogDelegateTools.writeOfflineSession(tenantId, this._delegateState.visitUserId(), sessionVisitor)
                .then(nullValue => sessionJcr);
        });
    }

    private captureOfflineWorkPackage(tenantId: string, sessionId: string, workPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackage';
        return null;
    }

    private initializeAfterCreateSession(resourcePathElems: string[], sessionVisitor: SessionVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        return Promise.resolve().then(voidValue => {
            Log.info(`${thisMethod} -- showing storage keys`);
            return SdaDialogDelegateTools.showAllStorageKeys();
        }).then(voidValue => {
            return SdaDialogDelegateTools.readDelegateState(pathFields.tenantId, sessionVisitor.visitUserId());
        }).then(delegateState => {
            Log.info(`${thisMethod} -- delegate state before initializing: ${delegateState.copyAsJsonString()}`);
            Log.info(`${thisMethod} -- selected work packages count: ${delegateState.selectedWorkPackageIds().length}`);
            delegateState.visitAndSetUserId(sessionVisitor.visitUserId());
            return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, delegateState).then(nullValue => {
                this._delegateState = delegateState;
                return SdaDialogDelegateTools.showAllStorageKeys().then(voidValue2 => {
                    return SdaDialogDelegateTools.readDelegateState(pathFields.tenantId, sessionVisitor.visitUserId());
                }).then(freshDelegateState => {
                    Log.info(`${thisMethod} -- delegate state after initializing: ${freshDelegateState.copyAsJsonString()}`);
                    Log.info(`${thisMethod} -- done initializing`);
                });
            });
        });
    }

    private online(): boolean {
        return this._delegateState.visitBriefcase().visitOnline();
    }

    private performAddWorkPackageToBriefcase(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performAddWorkPackageToBriefcase';
        // REQUIRED: Before we can add a Work Package to the briefcase, we must be online
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Cannot add a Work Package to the briefcase while offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const targets = ActionParametersVisitor.visitTargetsValue(body);
        if (targets && targets.length > 0) {
            for (const t of targets) {
                Log.info(`${thisMethod} -- adding selected work package id: ${t}`);
                this._delegateState.addSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, this._delegateState).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructAddToBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

    private performBriefcaseWorkbenchActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
        const response = SdaPostBriefcaseWorkbenchActionJsonSample.copyOfResponse();
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(response, pathFields.tenantId, pathFields.sessionId);
        return Promise.resolve(new JsonClientResponse(response, 303));
    }

    private performCreateSessionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performCreateSessionRequest';
        Log.info(`${thisMethod} -- create session request: ${JSON.stringify(body)}`);
        const loginVisitor = new LoginVisitor(body);
        Log.info(`${thisMethod} -- user id: ${loginVisitor.visitUserId()}`);
        return Promise.resolve(null);
    }

    private performEnterOfflineModeMenuActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        this.captureOfflineSession(baseUrl, pathFields.tenantId, pathFields.sessionId);
        this._delegateState.visitBriefcase().visitAndSetOnline(false);
        return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, this._delegateState).then(nullValue => {
            const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
            return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
        });
    }

    private performExitOfflineModeMenuActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        if (this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already online");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        this._delegateState.visitBriefcase().visitAndSetOnline(true);
        return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, this._delegateState).then(nullValue => {
            const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
            return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
        });
    }

    private performOfflineBriefcaseCommentsRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private performOfflineBriefcaseWorkPackagesRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        for (const id of this._delegateState.selectedWorkPackageIds()) {
            const workPackageVisitor = this._delegateState.visitWorkPackagesRecordSet().visitRecordAtId(id);
            if (workPackageVisitor) {
                RecordSetVisitor.addOrUpdateRecord(response, SelectedWorkPackageVisitor.createFromWorkPackageVisitor(workPackageVisitor));
            } else {
                Log.warn(`${thisMethod} -- WARNING: Selected work package not found: ${id}`);
            }
        }
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private performRemoveWorkPackageFromBriefcase(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performRemoveWorkPackageFromBriefcase';
        // REQUIRED: Before we can remove a Work Package from the briefcase, we must be online
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Cannot remove a Work Package from the briefcase while offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const targets = ActionParametersVisitor.visitTargetsValue(body);
        if (targets && targets.length > 0) {
            for (const t of targets) {
                Log.info(`${thisMethod} -- removing selected work package id: ${t}`);
                this._delegateState.removeSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return SdaDialogDelegateTools.writeDelegateState(pathFields.tenantId, this._delegateState).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructRemoveFromBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

}
