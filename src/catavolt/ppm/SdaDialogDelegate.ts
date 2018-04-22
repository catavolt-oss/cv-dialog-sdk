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
import {ValueIterator} from "../proxy/ValueIterator";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {SdaGetBriefcaseDialogJsonSample} from "./samples/SdaGetBriefcaseDialogJsonSample";
import {SdaPostBriefcaseWorkbenchActionJsonSample} from "./samples/SdaPostBriefcaseWorkbenchActionJsonSample";
import {SdaDialogDelegateStateVisitor} from "./SdaDialogDelegateStateVisitor";
import {SdaDialogDelegateTools} from "./SdaDialogDelegateTools";
import {SelectedWorkPackageVisitor} from "./SelectedWorkPackageVisitor";
import {WorkPackagesRecordSetVisitor} from "./WorkPackagesRecordSetVisitor";

export class SdaDialogDelegate implements DialogDelegate {

    private _dialogDelegateStateVisitor: SdaDialogDelegateStateVisitor = null;
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
        if (!this.online()) {
            throw new Error(`Blob request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> | null {
        Log.info("SdaDialogDelegate::getText -- path: " + resourcePath);
        if (!this.online()) {
            throw new Error(`Text request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> | null {
        Log.info("SdaDialogDelegate::openStream -- path: " + resourcePath);
        if (!this.online()) {
            throw new Error(`Stream request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public postMultipart<T>(baseUrl: string, resourcePath: string, formData: FormData): Promise<VoidClientResponse> | null {
        Log.info("SdaDialogDelegate::postMultipart -- path: " + resourcePath);
        if (!this.online()) {
            throw new Error(`Multipart request is not valid during offline mode: ${resourcePath}`);
        }
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
                const briefcaseVisitor = new DialogVisitor(response);
                briefcaseVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                briefcaseVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_BRIEFCASE_ROOT_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_DETAILS_DIALOG_NAME, //
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DETAILS_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_WORK_PACKAGES_DIALOG_NAME, //
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_WORK_PACKAGES_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME,
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_COMMENTS_DIALOG_ID);
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        } else if (DialogProxyTools.isGetRecord(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructGetRecordPath(resourcePathElems);
            if (SdaDialogDelegateTools.isOfflineBriefcaseDetailsDialogId(pathFields.dialogId)) {
                const response = this._dialogDelegateStateVisitor.visitBriefcase().enclosedJsonObject();
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        }
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode(resourcePath);
        }
        return null;
    }

    public postJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::postJson';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        Log.info(`${thisMethod} -- body: ${JSON.stringify(body)}`);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (SdaDialogDelegateTools.isWorkPackagesWorkbenchActionRequest(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
            // Switch to online session if necessary
            if (this.online() && pathFields.sessionId === SdaDialogDelegateTools.OFFLINE_SESSION_ID) {
                const onlineSessionId = this._dialogDelegateStateVisitor.visitSessionId();
                const onlineResourcePath = `tenants/${pathFields.tenantId}/sessions/${onlineSessionId}/workbenches/SDAWorkbenchLOCAL/actions/WorkPackages`;
                Log.info(`${thisMethod} -- switching to online session id: ${onlineSessionId}`);
                return DialogProxyTools.commonFetchClient().postJson(baseUrl, onlineResourcePath, body);
            }
        }
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
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode(resourcePath);
        }
        return null;
    }

    public putJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::putJson -- path: " + resourcePath);
        Log.info("SdaDialogDelegate::putJson -- body: " + JSON.stringify(body));
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode(resourcePath);
        }
        return null;
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::deleteJson -- path: " + resourcePath);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (DialogProxyTools.isDeleteSessionRequest(resourcePathElems)) {
            return this.performDeleteSessionRequest(baseUrl, resourcePathElems);
        }
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode(resourcePath);
        }
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
                    return this.initializeAfterCreateSession(baseUrl, resourcePathElems, body, new SessionVisitor(jsonObject)).then(voidValue => jcr);
                } else if (SdaDialogDelegateTools.isWorkPackagesListRecordSet(resourcePathElems, jsonObject)) {
                    const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
                    const workPackagesRecordSetVisitor = new WorkPackagesRecordSetVisitor(jsonObject);
                    workPackagesRecordSetVisitor.updateBriefcaseColumnUsingSelections(this._dialogDelegateStateVisitor.selectedWorkPackageIds());
                    this._dialogDelegateStateVisitor.visitWorkPackagesRecordSet().addOrUpdateAllRecords(workPackagesRecordSetVisitor);
                    return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(voidValue => {
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

    private captureOfflineSession(baseUrl: string, tenantId: string, sessionId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineSession';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}`;
        const sessionPr = DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath);
        return sessionPr.then(sessionJcr => {
            Log.info(`${thisMethod} -- session value: ${JSON.stringify(sessionJcr.value)}`);
            const sessionVisitor = new SessionVisitor(sessionJcr.value);
            sessionVisitor.propagateSessionId(SdaDialogDelegateTools.offlineSessionId());
            return SdaDialogDelegateTools.writeOfflineSession(tenantId, this._dialogDelegateStateVisitor.visitUserId(), sessionVisitor)
                .then(nullValue => sessionJcr);
        });
    }

    private captureNextOfflineWorkPackage(previousPr: Promise<void>, workPackageIdsIterator: ValueIterator<string>, tenantId: string, sessionId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackage';
        return previousPr.then(voidValue => {
            if (workPackageIdsIterator.done()) {
                return null;
            }
            const nextWorkPackageId = workPackageIdsIterator.next();
            Log.info(`${thisMethod} -- capturing work package for offline: ${nextWorkPackageId}`);
            const nextWorkPackagePr = Promise.resolve();
            return this.captureNextOfflineWorkPackage(nextWorkPackagePr, workPackageIdsIterator, tenantId, sessionId);
        });
    }

    private captureOfflineWorkPackage(tenantId: string, sessionId: string, workPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackage';
        return Promise.resolve();
    }

    private performLogoutForOfflineProcessing(tenantId: string, sessionId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performLogoutForOfflineProcessing';
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}`;
        return DialogProxyTools.commonFetchClient().deleteJson(this._dialogDelegateStateVisitor.visitBaseUrl(), resourcePath).then(deleteJcr => {
            Log.info(`${thisMethod} -- logout for offline completed with result ${JSON.stringify(deleteJcr.value)}`);
            return deleteJcr;
        });
    }

    private performLoginForOnlineProcessing(tenantId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performLoginForOnlineProcessing';
        const resourcePath = `tenants/${tenantId}/sessions`;
        const loginModel = DialogProxyTools.constructLoginModel(this._dialogDelegateStateVisitor.visitUserId(),
            this._dialogDelegateStateVisitor.visitPassword());
        return DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), resourcePath, loginModel).then(jcr => {
            Log.info(`${thisMethod} -- login for online completed with result ${JSON.stringify(jcr.value)}`);
            return jcr;
        });
    }

    private captureOfflineWorkPackages(tenantId: string, sessionId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackages';
        Log.info(`${thisMethod} -- capturing work packages list for offline`);
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbenchLOCAL/actions/WorkPackages`;
        return DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), redirectionPath, {}).then(rootDialogRedirectionJcr => {
            if (rootDialogRedirectionJcr.statusCode !== 303) {
                throw new Error(`Unexpected result when posting for WorkPackages: ${rootDialogRedirectionJcr.statusCode}`);
            }
            Log.info(`${thisMethod} -- work packages redirection: ${JSON.stringify(rootDialogRedirectionJcr.value)}`);
            const dialogRedirectionVisitor = new DialogRedirectionVisitor(rootDialogRedirectionJcr.value);
            const onlineRootDialogId = dialogRedirectionVisitor.visitDialogId();
            dialogRedirectionVisitor.propagateDialogId(SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_ROOT_DIALOG_ID);
            return SdaDialogDelegateTools.writeOfflineWorkPackagesRedirection(tenantId, this._dialogDelegateStateVisitor.visitUserId(), dialogRedirectionVisitor).then(nullValue => {
                const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineRootDialogId}`;
                return DialogProxyTools.commonFetchClient().getJson(this._dialogDelegateStateVisitor.visitBaseUrl(), dialogPath).then(rootDialogJcr => {
                    if (rootDialogJcr.statusCode !== 200) {
                        throw new Error(`Unexpected result when getting dialog for WorkPackages: ${rootDialogJcr.statusCode}`);
                    }
                    Log.info(`${thisMethod} -- work packages dialog: ${JSON.stringify(rootDialogJcr.value)}`);
                    const rootDialogVisitor = new DialogVisitor(rootDialogJcr.value);
                    rootDialogVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_ROOT_DIALOG_ID);
                    const workPackagesListDialogVisitor = rootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME);
                    const onlineWorkPackagesListDialogId = workPackagesListDialogVisitor.visitId();
                    workPackagesListDialogVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_LIST_DIALOG_ID);
                    Log.info(`${thisMethod} -- WORK PACKAGES!!!!!: ${rootDialogVisitor.copyAsJsonString()}`);
                    Log.info(`${thisMethod} -- capturing selected work packages for offline`);
                    const workPackageIdsIterator = new ValueIterator(this._dialogDelegateStateVisitor.selectedWorkPackageIds());
                    return this.captureNextOfflineWorkPackage(Promise.resolve(), workPackageIdsIterator, tenantId, sessionId);
                });
            });
        });
    }

    private initializeAfterCreateSession(baseUrl: string, resourcePathElems: string[], body: StringDictionary, sessionVisitor: SessionVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        return Promise.resolve().then(voidValue => {
            Log.info(`${thisMethod} -- showing storage keys`);
            return SdaDialogDelegateTools.showAllStorageKeys();
        }).then(voidValue => {
            return SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        }).then(dialogDelegateStateVisitor => {
            Log.info(`${thisMethod} -- dialog delegate state before initializing: ${dialogDelegateStateVisitor.copyAsJsonString()}`);
            Log.info(`${thisMethod} -- selected work packages count: ${dialogDelegateStateVisitor.selectedWorkPackageIds().length}`);
            const loginVisitor = new LoginVisitor(body);
            dialogDelegateStateVisitor.visitAndSetBaseUrl(baseUrl);
            dialogDelegateStateVisitor.visitAndSetTenantId(pathFields.tenantId);
            dialogDelegateStateVisitor.visitAndSetSessionId(sessionVisitor.visitId());
            dialogDelegateStateVisitor.visitAndSetUserId(sessionVisitor.visitUserId());
            dialogDelegateStateVisitor.visitAndSetPassword(loginVisitor.visitPassword());
            // dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitAndClearRecords();
            return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, dialogDelegateStateVisitor).then(nullValue => {
                this._dialogDelegateStateVisitor = dialogDelegateStateVisitor;
                return SdaDialogDelegateTools.showAllStorageKeys().then(voidValue2 => {
                    return SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
                }).then(freshDialogDelegateStateVisitor => {
                    Log.info(`${thisMethod} -- dialog delegate state after initializing: ${freshDialogDelegateStateVisitor.copyAsJsonString()}`);
                    Log.info(`${thisMethod} -- done initializing`);
                });
            });
        });
    }

    private online(): boolean {
        return this._dialogDelegateStateVisitor.visitBriefcase().visitOnline();
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
                this._dialogDelegateStateVisitor.addSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructAddToBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

    private performBriefcaseWorkbenchActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
        const dialogRedirection = SdaPostBriefcaseWorkbenchActionJsonSample.copyOfResponse();
        DialogRedirectionVisitor.propagateDialogId(dialogRedirection, SdaDialogDelegateTools.OFFLINE_BRIEFCASE_ROOT_DIALOG_ID);
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(dialogRedirection, pathFields.tenantId, pathFields.sessionId);
        return Promise.resolve(new JsonClientResponse(dialogRedirection, 303));
    }

    private performCreateSessionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performCreateSessionRequest';
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        const loginVisitor = new LoginVisitor(body);
        return SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, loginVisitor.visitUserId()).then(delegateState => {
            if (!delegateState) {
                return null;
            }
            if (!delegateState.visitBriefcase().visitOnline()) {
                return SdaDialogDelegateTools.readOfflineSession(pathFields.tenantId, delegateState.visitUserId()).then(offlineSessionVisitor => {
                    Log.info(`${thisMethod} -- returning offline session: ${offlineSessionVisitor.copyAsJsonString()}`);
                    return new JsonClientResponse(offlineSessionVisitor.enclosedJsonObject(), 200);
                });
            }
            return null;
        });
    }

    private performDeleteSessionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performDeleteSessionRequest';
        if (!this._dialogDelegateStateVisitor.visitBriefcase().visitOnline()) {
            const pathFields = DialogProxyTools.deconstructDeleteSessionPath(resourcePathElems);
            return Promise.resolve(new JsonClientResponse(SdaDialogDelegateTools.constructOfflineLogoutResponse(pathFields.sessionId), 200));
        }
        return null;
    }

    private performEnterOfflineModeMenuActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return this.captureOfflineWorkPackages(pathFields.tenantId, pathFields.sessionId).then(nullWorkPackagesValue => {
            return this.captureOfflineSession(baseUrl, pathFields.tenantId, pathFields.sessionId).then(offlineSessionJcr => {
                this._dialogDelegateStateVisitor.visitBriefcase().visitAndSetOnline(false);
                return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
                    const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
                    return this.performLogoutForOfflineProcessing(pathFields.tenantId, pathFields.sessionId).then(nullLogoutValue => {
                        return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
                    });
                });
            });
        });
    }

    private performExitOfflineModeMenuActionRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        if (this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already online");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return this.performLoginForOnlineProcessing(pathFields.tenantId).then(sessionJcr => {
            if (sessionJcr.statusCode !== 200) {
                return sessionJcr;
            }
            const sessionVisitor = new SessionVisitor(sessionJcr.value);
            this._dialogDelegateStateVisitor.visitAndSetSessionId(sessionVisitor.visitId());
            this._dialogDelegateStateVisitor.visitBriefcase().visitAndSetOnline(true);
            return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
                const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
                return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
            });
        });
    }

    private performOfflineBriefcaseCommentsRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private performOfflineBriefcaseWorkPackagesRequest(baseUrl: string, resourcePathElems: string[], body?: StringDictionary): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        for (const id of this._dialogDelegateStateVisitor.selectedWorkPackageIds()) {
            const workPackageVisitor = this._dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitRecordAtId(id);
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
                this._dialogDelegateStateVisitor.removeSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructRemoveFromBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

}
