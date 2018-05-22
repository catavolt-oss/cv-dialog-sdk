import {BlobClientResponse} from "../client/BlobClientResponse";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io/StreamProducer';
import {ActionParametersVisitor} from "../proxy/ActionParametersVisitor";
import {ContentRedirectionVisitor} from "../proxy/ContentRedirectionVisitor";
import {DialogDelegate} from "../proxy/DialogDelegate";
import {DialogProxyTools} from "../proxy/DialogProxyTools";
import {DialogRedirectionVisitor} from "../proxy/DialogRedirectionVisitor";
import {DialogRequest} from "../proxy/DialogRequest";
import {DialogVisitor} from "../proxy/DialogVisitor";
import {LargePropertyVisitor} from "../proxy/LargePropertyVisitor";
import {LoginVisitor} from "../proxy/LoginVisitor";
import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {RecordVisitor} from "../proxy/RecordVisitor";
import {RedirectionVisitor} from "../proxy/RedirectionVisitor";
import {SessionVisitor} from "../proxy/SessionVisitor";
import {ValueIterator} from "../proxy/ValueIterator";
import {WriteLargePropertyParametersVisitor} from "../proxy/WriteLargePropertyParametersVisitor";
import {storage} from "../storage";
import {Base64} from "../util/Base64";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {Briefcase_Briefcase_FORM} from "./samples/Briefcase_Briefcase_FORM";
import {Briefcase_Briefcase_FORM_REDIRECTION} from "./samples/Briefcase_Briefcase_FORM_REDIRECTION";
import {Documents_CreateComment_FORM} from "./samples/Documents_CreateComment_FORM";
import {Documents_CreateComment_FORM_REDIRECTION} from "./samples/Documents_CreateComment_FORM_REDIRECTION";
import {Documents_CreateComment_RECORD} from "./samples/Documents_CreateComment_RECORD";
import {SdaPostWorkPackagesRecords1JsonSample} from "./samples/SdaPostWorkPackagesRecords1JsonSample";
import {SdaDialogDelegateStateVisitor} from "./SdaDialogDelegateStateVisitor";
import {SdaDialogDelegateTools} from "./SdaDialogDelegateTools";
import {SelectedWorkPackageVisitor} from "./SelectedWorkPackageVisitor";
import {WorkPackagesRecordSetVisitor} from "./WorkPackagesRecordSetVisitor";

export class SdaDialogDelegate implements DialogDelegate {

    private _dialogDelegateStateVisitor: SdaDialogDelegateStateVisitor = null;

    public initialize(): Promise<void> {
        Log.info("SdaDialogDelegate::initialize -- nothing to initialize");
        return Promise.resolve();
    }

    // --- Request Handlers --- //

    public getBlob(request: DialogRequest): Promise<BlobClientResponse> | null {
        Log.info("SdaDialogDelegate::getBlob -- path: " + request.resourcePath());
        if (!this.delegateOnline()) {
            throw new Error(`Blob request is not valid during offline mode: ${request.resourcePath()}`);
        }
        return null;
    }

    public getText(request: DialogRequest): Promise<TextClientResponse> | null {
        Log.info("SdaDialogDelegate::getText -- path: " + request.resourcePath());
        if (!this.delegateOnline()) {
            throw new Error(`Text request is not valid during offline mode: ${request.resourcePath()}`);
        }
        return null;
    }

    public openStream(request: DialogRequest): Promise<StreamProducer> | null {
        Log.info("SdaDialogDelegate::openStream -- path: " + request.resourcePath());
        if (!this.delegateOnline()) {
            throw new Error(`Stream request is not valid during offline mode: ${request.resourcePath()}`);
        }
        return null;
    }

    public postMultipart<T>(request: DialogRequest): Promise<VoidClientResponse> | null {
        Log.info("SdaDialogDelegate::postMultipart -- path: " + request);
        if (!this.delegateOnline()) {
            throw new Error(`Multipart request is not valid during offline mode: ${request.resourcePath()}`);
        }
        return null;
    }

    public getJson(request: DialogRequest): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::getJson';
        Log.info(`${thisMethod} -- path: ${request.resourcePath()}`);
        if (request.isGetDialogPath()) {
            const pathFields = request.deconstructGetDialogPath();
            if (SdaDialogDelegateTools.isOfflineBriefcaseDialogId(pathFields.dialogId)) {
                const response = Briefcase_Briefcase_FORM.copyOfResponse();
                const briefcaseVisitor = new DialogVisitor(response);
                briefcaseVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                briefcaseVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_ROOT_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_DETAILS_DIALOG_NAME, SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_DETAILS_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_WORK_PACKAGES_DIALOG_NAME, SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_WORK_PACKAGES_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME, SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_COMMENTS_ID);
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        } else if (request.isGetRecordPath()) {
            const pathFields = request.deconstructGetRecordPath();
            if (SdaDialogDelegateTools.isOfflineBriefcaseDetailsDialogId(pathFields.dialogId)) {
                const response = this.delegateBriefcaseVisitor().enclosedJsonObject();
                return Promise.resolve(new JsonClientResponse(response, 200));
            } else if (SdaDialogDelegateTools.isOfflineDocumentsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineDocumentsPropertiesRecordRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineTagsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineTagsPropertiesRecordRequest(request);
            }
        }
        if (!this.delegateOnline()) {
            if (request.isGetDialogPath()) {
                return DialogProxyTools.readDialogAsOfflineResponse(this.delegateUserId(), request);
            }
            if (request.isGetRecordPath()) {
                return DialogProxyTools.readRecordAsOfflineResponse(this.delegateUserId(), request);
            }
            return Promise.resolve(DialogProxyTools.constructRequestNotValidDuringOfflineMode('getJson', request.resourcePath()));
        }
        return null;
    }

    public postJson(request: DialogRequest): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::postJson';
        Log.info(`${thisMethod} -- path: ${request.resourcePath()}`);
        Log.info(`${thisMethod} -- body: ${JSON.stringify(request.body())}`);
        if (SdaDialogDelegateTools.isWorkPackagesAddToBriefcaseMenuActionRequest(request)) {
            return this.performWorkPackagesAddWorkPackageToBriefcase(request);
        } else if (SdaDialogDelegateTools.isWorkPackagesRemoveFromBriefcaseMenuActionRequest(request)) {
            return this.performWorkPackagesRemoveWorkPackageFromBriefcase(request);
        } else if (request.isCreateSessionPath()) {
            return this.performCreateSessionRequest(request);
        } else if (SdaDialogDelegateTools.isBriefcaseWorkbenchActionRequest(request)) {
            return this.performBriefcaseWorkbenchActionRequest(request);
        } else if (SdaDialogDelegateTools.isOfflineBriefcaseWorkPackagesRequest(request)) {
            return this.performOfflineBriefcaseWorkPackagesRequest(request);
        } else if (SdaDialogDelegateTools.isOfflineBriefcaseCommentsRecordSetRequest(request)) {
            return this.performOfflineBriefcaseCommentsRequest(request);
        } else if (SdaDialogDelegateTools.isEnterOfflineModeMenuActionRequest(request)) {
            return this.performEnterOfflineModeMenuActionRequest(request);
        } else if (SdaDialogDelegateTools.isExitOfflineModeMenuActionRequest(request)) {
            return this.performExitOfflineModeMenuActionRequest(request);
        }
        if (!this.delegateOnline()) {
            if (request.isPostWorkbenchActionPath()) {
                return DialogProxyTools.readWorkbenchActionRedirectionAsOfflineResponse(this.delegateUserId(), request);
            } else if (request.isPostMenuActionPath()) {
                if (request.actionId() === 'alias_ShowDocs') {
                    return this.performOfflineShowDocsMenuAction(request);
                } else if (request.actionId() === 'alias_CreateComment') {
                    return this.performOfflineCreateCommentMenuAction(request);
                }
                return DialogProxyTools.readMenuActionRedirectionAsOfflineResponse(this.delegateUserId(), request);
            } else if (request.isPostRecordsPath()) {
                return DialogProxyTools.readRecordSetAsOfflineResponse(this.delegateUserId(), request);
            } else if (request.isPostSessionContentPath()) {
                return DialogProxyTools.readSessionContentAsOfflineResponse(this.delegateUserId(), request);
            }
            return Promise.resolve(DialogProxyTools.constructRequestNotValidDuringOfflineMode('postJson', request.resourcePath()));
        }
        return null;
    }

    public putJson(request: DialogRequest): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::putJson -- path: " + request.resourcePath());
        Log.info("SdaDialogDelegate::putJson -- body: " + JSON.stringify(request.body()));
        if (!this.delegateOnline()) {
            if (request.isPutViewModePath()) {
                const pathFields = request.deconstructPutViewModePath();
                if (pathFields.dialogId.startsWith('Documents_CreateComment$') && pathFields.viewMode === 'READ') {
                    return Promise.resolve(this.constructCreateCommentNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId));
                }
            } else if (request.isPutRecordPath()) {
                const pathFields = request.deconstructPutRecordPath();
                const recordVisitor = new RecordVisitor(request.body());
                return DialogProxyTools.writeRecordCommit(this.delegateUserId(), pathFields.tenantId, pathFields.dialogId, recordVisitor).then(nullValue => {
                    this._dialogDelegateStateVisitor.visitMobileCommentsRecordSet().acceptCreateComment(pathFields.dialogId, recordVisitor);
                    return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue2 => {
                        return this.constructCreateCommentNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId);
                    });
                });
            } else if (request.isPutPropertyPath()) {
                const pathFields = request.deconstructPutPropertyPath();
                const writeLargePropertyParameters = new WriteLargePropertyParametersVisitor(request.body());
                return DialogProxyTools.writePropertyCommit(this.delegateUserId(), pathFields.tenantId, pathFields.dialogId, pathFields.propertyName, writeLargePropertyParameters).then(nullValue => {
                    return this.constructCreateCommentNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId);
                });
            }
            return Promise.resolve(DialogProxyTools.constructRequestNotValidDuringOfflineMode('putJson', request.resourcePath()));
        }
        return null;
    }

    public deleteJson(request: DialogRequest): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::deleteJson -- path: " + request.resourcePath());
        if (request.isDeleteSessionPath()) {
            return this.performDeleteSessionRequest(request);
        }
        if (!this.delegateOnline()) {
            return Promise.resolve(DialogProxyTools.constructRequestNotValidDuringOfflineMode('deleteJson', request.resourcePath()));
        }
        return null;
    }

    // --- Response Handlers --- //

    public handleDeleteJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handleDeleteJsonResponse -- path: " + request.resourcePath());
        response.then(jcr => Log.info("SdaDialogDelegate::handleDeleteJsonResponse -- json response: " + JSON.stringify(jcr.value)));
        return response;
    }

    public handleGetBlobResponse(request: DialogRequest, response: Promise<BlobClientResponse>): Promise<BlobClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetBlobResponse -- path: " + request.resourcePath());
        response.then(bcr => Log.info("SdaDialogDelegate::handleGetBlobResponse -- blob response: " + JSON.stringify(bcr.value)));
        return response;
    }

    public handleGetJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetJsonResponse -- path: " + request.resourcePath());
        response.then(jcr => Log.info("SdaDialogDelegate::handleGetJsonResponse -- json response: " + JSON.stringify(jcr.value)));
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                const jsonObject = jcr.value as StringDictionary;
                if (SdaDialogDelegateTools.isWorkPackagesRootDialog(jsonObject)) {
                    const workPackagesDialog = SdaDialogDelegateTools.insertBriefcaseMetaDataIntoWorkPackagesDialog(jsonObject);
                    return new JsonClientResponse(workPackagesDialog, 200);
                }
            }
            return jcr;
        });
    }

    public handleGetTextResponse(request: DialogRequest, response: Promise<TextClientResponse>): Promise<TextClientResponse> | null {
        Log.info("SdaDialogDelegate::handleGetTextResponse -- path: " + request.resourcePath());
        response.then(tcr => Log.info("SdaDialogDelegate::handleGetTextResponse -- text response: " + JSON.stringify(tcr.value)));
        return response;
    }

    public handleOpenStreamResponse(request: DialogRequest, response: Promise<StreamProducer>): Promise<StreamProducer> | null {
        Log.info("SdaDialogDelegate::handleOpenStreamResponse -- path: " + request.resourcePath());
        response.then(sp => Log.info("SdaDialogDelegate::handleOpenStreamResponse -- stream producer response: " + sp));
        return response;
    }

    public handlePostJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::handlePostJsonResponse';
        Log.info(`${thisMethod} -- path: ${request.resourcePath()}`);
        response.then(jcr => Log.info(`${thisMethod} -- json response: ${JSON.stringify(jcr.value)}`));
        return response.then(jsonClientResponse => {
            if (jsonClientResponse.statusCode === 200) {
                const jsonObject = jsonClientResponse.value as StringDictionary;
                if (DialogProxyTools.isSessionModel(jsonObject)) {
                    return this.initializeAfterCreateSession(request, new SessionVisitor(jsonObject)).then(nullValue => jsonClientResponse);
                } else if (SdaDialogDelegateTools.isWorkPackagesListRecordSet(request, jsonObject)) {
                    if (this.delegateOnline()) {
                        const pathFields = request.deconstructPostRecordsPath();
                        const workPackagesRecordSetVisitor = new WorkPackagesRecordSetVisitor(jsonObject);
                        workPackagesRecordSetVisitor.updateBriefcaseColumnUsingSelections(this.delegateSelectedWorkPackageIds());
                        this.delegateWorkPackagesRecordSetVisitor().addOrUpdateAllRecords(workPackagesRecordSetVisitor);
                        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
                            return jsonClientResponse;
                        });
                    }
                }
            }
            return jsonClientResponse;
        });
    }

    public handlePostMultipartResponse<T>(request: DialogRequest, response: Promise<VoidClientResponse>): Promise<VoidClientResponse> | null {
        Log.info("SdaDialogDelegate::handlePostMultipartResponse -- path: " + request.resourcePath());
        response.then(vcr => Log.info("SdaDialogDelegate::handlePostMultipartResponse -- void response: " + JSON.stringify(vcr.value)));
        return response;
    }

    public handlePutJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::handlePutJsonResponse -- path: " + request.resourcePath());
        return response;
    }

    // --- Others --- //

    private captureOfflineSession(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineSession';
        const resourcePath = `tenants/${request.tenantId()}/sessions/${request.sessionId()}`;
        const sessionPr = DialogProxyTools.commonFetchClient().getJson(request.baseUrl(), resourcePath);
        return sessionPr.then(sessionJcr => {
            Log.info(`${thisMethod} -- session value: ${JSON.stringify(sessionJcr.value)}`);
            const sessionVisitor = new SessionVisitor(sessionJcr.value);
            return SdaDialogDelegateTools.writeOfflineSession(request.tenantId(), this.delegateUserId(), sessionVisitor)
                .then(nullValue => sessionJcr);
        });
    }

    private async captureNextOfflineWorkPackage(baseUrl: string, tenantId: string, sessionId: string, onlineWorkPackagesListDialogId: string, nextWorkPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineWorkPackage';
        Log.info(`${thisMethod} -- capturing work package for offline: ${nextWorkPackageId}`);
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, onlineWorkPackagesListDialogId, 'alias_Open', nextWorkPackageId, null);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_PROPERTIES_DIALOG_NAME);
        const documentsRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const beforeDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const afterDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        for (const r of documentsRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineDocumentContent(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, r);
        }
        await this.captureNextOfflineTags(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, nextWorkPackageId);
        return null;
    }

    private async captureNextOfflineTags(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialog: DialogVisitor, nextWorkPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineTags';
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeDocumentsListDialog.visitId(), 'alias_ShowTags', null, nextWorkPackageId);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME);
        const tagsRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const beforeTagsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const afterTagsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        return null;
    }

    private async captureNextOfflineDocumentContent(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialog: DialogVisitor, nextDocumentRecordVisitor: RecordVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineDocumentContent';
        const onlineDocumentsListDialogId = beforeDocumentsListDialog.visitId();
        const offlineDocumentsListDialogId = afterDocumentsListDialog.visitId();
        Log.info(`${thisMethod} -- online list dialog id: ${onlineDocumentsListDialogId}`);
        Log.info(`${thisMethod} -- offline list dialog id: ${offlineDocumentsListDialogId}`);
        // GET REDIRECTION //
        const actionId = 'alias_OpenLatestFile';
        const nextDocumentId = nextDocumentRecordVisitor.visitRecordId();
        const nextDocumentIdEncoded = Base64.encodeUrlSafeString(nextDocumentId);
        Log.info(`${thisMethod} -- next document id: ${nextDocumentId} encoded as: ${nextDocumentIdEncoded}`);
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineDocumentsListDialogId}/actions/${actionId}`;
        const redirectionParameters = {
            targets: [nextDocumentId],
            type: "hxgn.api.dialog.ActionParameters"
        };
        const redirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, redirectionPath, redirectionParameters);
        if (redirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening Document: ${nextDocumentId}`);
        }
        // TODO: this is a hack for "document not found" scenario -- fix later
        if (redirectionJcr.value['type'] === 'hxgn.api.dialog.DialogRedirection') {
            Log.info(`${thisMethod} -- skipping dialog redirection (document not found): ${JSON.stringify(redirectionJcr.value)}`);
            return null;
        }
        Log.info(`${thisMethod} -- document content redirection: ${JSON.stringify(redirectionJcr.value)}`);
        // CLARIFICATION: We can navigate to the same document from multiple locations, therefore documents are shared
        // among entities by reference. Specifically a work package and tag can share the same document. We capitalize
        // on this fact by rewriting the content redirection identifier as derivative of the document id. The effect
        // allows us to determine if we have already downloaded the content, and if we have, to reference the same
        // content from multiple redirections.
        const contentRedirectionVisitor = new ContentRedirectionVisitor(redirectionJcr.value);
        const onlineContentId = contentRedirectionVisitor.visitId();
        const actionIdAtRecordId = `${actionId}@${nextDocumentIdEncoded}`;
        await DialogProxyTools.writeContentRedirection(this.delegateUserId(), tenantId, offlineDocumentsListDialogId, actionIdAtRecordId, contentRedirectionVisitor);
        // GET CONTENT //
        let nextSequence = 0;
        while (true) {
            const contentPath = `tenants/${tenantId}/sessions/${sessionId}/content/${onlineContentId}`;
            const readLargePropertyParametersJson = {
                maxBytes: 131072,
                sequence: nextSequence,
                type: "hxgn.api.dialog.ReadLargePropertyParameters"
            };
            const largePropertyJcr = await DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), contentPath, readLargePropertyParametersJson);
            if (largePropertyJcr.statusCode !== 200) {
                throw new Error(`Unexpected result when reading content: ${onlineContentId}`);
            }
            const largePropertyVisitor = new LargePropertyVisitor(largePropertyJcr.value);
            await DialogProxyTools.writeContentChunk(this.delegateUserId(), tenantId, onlineContentId, nextSequence, largePropertyVisitor);
            if (!largePropertyVisitor.visitHasMore()) {
                break;
            }
            nextSequence++;
        }
        return null;
    }

    private constructCreateCommentNullRedirection(tenantId: string, sessionId: string, dialogId: string): JsonClientResponse {
        const nullRedirection = DialogProxyTools.constructNullRedirection(tenantId, sessionId);
        const nullRedirectionVisitor = new RedirectionVisitor(nullRedirection);
        nullRedirectionVisitor.visitAndSetReferringDialogAlias('Documents_CreateComment');
        nullRedirectionVisitor.visitAndSetReferringDialogName('Documents_CreateComment');
        nullRedirectionVisitor.visitAndSetReferringDialogId(dialogId);
        nullRedirectionVisitor.visitAndSetReferringDialogMode('DESTROYED');
        return new JsonClientResponse(nullRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private delegateBaseUrl(): string {
        return this._dialogDelegateStateVisitor.visitBaseUrl();
    }

    private delegateBriefcaseVisitor(): BriefcaseVisitor {
        return this._dialogDelegateStateVisitor.visitBriefcase();
    }

    private delegateOnline(): boolean {
        return this._dialogDelegateStateVisitor.visitBriefcase().visitOnline();
    }
    private delegateSelectedWorkPackageIds() {
        return this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds();
    }

    private delegateUserId(): string {
        return this._dialogDelegateStateVisitor.visitUserId();
    }

    private delegateWorkPackagesRecordSetVisitor(): WorkPackagesRecordSetVisitor {
        return this._dialogDelegateStateVisitor.visitWorkPackagesRecordSet();
    }

    private async performLoginForOnlineProcessing(tenantId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performLoginForOnlineProcessing';
        const resourcePath = `tenants/${tenantId}/sessions`;
        const loginModel = DialogProxyTools.constructLoginModel(this.delegateUserId(), this._dialogDelegateStateVisitor.visitPassword());
        const jsonClientResponse = await DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), resourcePath, loginModel);
        Log.info(`${thisMethod} -- login for online completed with result ${JSON.stringify(jsonClientResponse.value)}`);
        return jsonClientResponse;
    }

    private async captureOfflineWorkPackages(enterOfflineRequest: DialogRequest): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackages';
        const pathFields = enterOfflineRequest.deconstructPostMenuActionPath();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        // CAPTURE OFFLINE WORK PACKAGES REDIRECTION AND ROOT DIALOG
        Log.info(`${thisMethod} -- capturing work packages list for offline`);
        const userId = this.delegateUserId();
        const beforeAndAfterValues = await DialogProxyTools.captureWorkbenchActionRedirectionAndDialog(userId, enterOfflineRequest.baseUrl(), tenantId, sessionId, 'SDAWorkbench', 'WorkPackages');
        // CAPTURE OFFLINE WORK PACKAGES RECORD SET
        Log.info(`${thisMethod} -- capturing selected work packages for offline`);
        const dialogVisitor = new DialogVisitor(beforeAndAfterValues.beforeDialog);
        const listDialogVisitor = dialogVisitor.visitChildAtName(SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME);
        const listDialogId = listDialogVisitor.visitId();
        const sampleRecordSet = SdaPostWorkPackagesRecords1JsonSample.copyOfResponse();
        const recordSetVisitor = new RecordSetVisitor(sampleRecordSet);
        recordSetVisitor.visitAndClearRecords();
        recordSetVisitor.visitAndSetHasMore(false);
        for (const wpv of this.delegateWorkPackagesRecordSetVisitor().visitRecords()) {
            if (wpv.visitBriefcase()) {
                recordSetVisitor.addOrUpdateRecord(wpv);
            }
        }
        await DialogProxyTools.writeRecordSet(userId, tenantId, SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME, recordSetVisitor);
        const workPackageIdsIterator = new ValueIterator(this.delegateSelectedWorkPackageIds());
        while (!workPackageIdsIterator.done()) {
            await this.captureNextOfflineWorkPackage(enterOfflineRequest.baseUrl(), tenantId, sessionId, listDialogId, workPackageIdsIterator.next());
        }
    }

    private async initializeAfterCreateSession(request: DialogRequest, sessionVisitor: SessionVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = request.deconstructPostSessionsPath();
        await SdaDialogDelegateTools.showAllStorageKeys();
        await SdaDialogDelegateTools.showAllStorageKeysAndValues();
        const dialogDelegateStateVisitor = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        Log.info(`${thisMethod} -- dialog delegate state before initializing: ${dialogDelegateStateVisitor.copyAsJsonString()}`);
        Log.info(`${thisMethod} -- selected work packages count: ${dialogDelegateStateVisitor.visitSelectedWorkPackageIds().length}`);
        const loginVisitor = new LoginVisitor(request.body());
        dialogDelegateStateVisitor.visitAndSetBaseUrl(request.baseUrl());
        dialogDelegateStateVisitor.visitAndSetTenantId(pathFields.tenantId);
        dialogDelegateStateVisitor.visitAndSetSessionId(sessionVisitor.visitId());
        dialogDelegateStateVisitor.visitAndSetUserId(sessionVisitor.visitUserId());
        dialogDelegateStateVisitor.visitAndSetPassword(loginVisitor.visitPassword());
        // dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitAndClearRecords();
        await SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, dialogDelegateStateVisitor);
        this._dialogDelegateStateVisitor = dialogDelegateStateVisitor;
        const freshDialogDelegateStateVisitor = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        Log.info(`${thisMethod} -- dialog delegate state after initializing: ${freshDialogDelegateStateVisitor.copyAsJsonString()}`);
        Log.info(`${thisMethod} -- done initializing`);
    }

    private performBriefcaseWorkbenchActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostWorkbenchActionPath();
        const dialogRedirection = Briefcase_Briefcase_FORM_REDIRECTION.copyOfResponse();
        DialogRedirectionVisitor.propagateDialogId(dialogRedirection, SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_ROOT_ID);
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(dialogRedirection, pathFields.tenantId, pathFields.sessionId);
        return Promise.resolve(new JsonClientResponse(dialogRedirection, 303));
    }

    private performCreateSessionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performCreateSessionRequest';
        const pathFields = request.deconstructPostSessionsPath();
        const loginVisitor = new LoginVisitor(request.body());
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

    private performDeleteSessionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performDeleteSessionRequest';
        if (!this.delegateOnline()) {
            const pathFields = request.deconstructDeleteSessionPath();
            return Promise.resolve(new JsonClientResponse(SdaDialogDelegateTools.constructOfflineLogoutResponse(pathFields.sessionId), 200));
        }
        return null;
    }

    private performEnterOfflineModeMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        if (!this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = request.deconstructPostMenuActionPath();
        return this.captureOfflineWorkPackages(request).then(nullWorkPackagesValue => {
            return this.captureOfflineSession(request).then(offlineSessionJcr => {
                this.delegateBriefcaseVisitor().visitAndSetOnline(false);
                return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
                    const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
                    return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
                });
            });
        });
    }

    private async performExitOfflineModeMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        if (this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already online");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = request.deconstructPostMenuActionPath();
        const sessionJcr = await this.performLoginForOnlineProcessing(pathFields.tenantId);
        if (sessionJcr.statusCode !== 200) {
            return sessionJcr;
        }
        const onlineSessionVisitor = new SessionVisitor(sessionJcr.value);
        const tenantId = onlineSessionVisitor.visitTenantId();
        const sessionId = onlineSessionVisitor.visitId();
        // ***** Get latest work packages *****
        const workPackagesWorkbenchActionPath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbench/actions/WorkPackages`;
        Log.info(`${thisMethod} -- getting work packages redirection: ${workPackagesWorkbenchActionPath}`);
        const workPackagesRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), workPackagesWorkbenchActionPath, {});
        if (workPackagesRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting for online work packages: ${workPackagesRedirectionJcr.statusCode}`);
        }
        const workPackagesRedirectionVisitor = new DialogRedirectionVisitor(workPackagesRedirectionJcr.value);
        const workPackagesDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${workPackagesRedirectionVisitor.visitDialogId()}`;
        Log.info(`${thisMethod} -- getting work packages dialog: ${workPackagesDialogPath}`);
        const workPackagesDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), workPackagesDialogPath);
        if (workPackagesDialogJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting work packages dialog: ${workPackagesDialogJcr.statusCode}`);
        }
        const workPackagesRootDialogVisitor = new DialogVisitor(workPackagesDialogJcr.value);
        const workPackagesListDialogVisitor = workPackagesRootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME);
        const workPackagesQueryRecordsPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${workPackagesListDialogVisitor.visitId()}/records`;
        const workPackagesQueryParameters = {
            fetchDirection: "FORWARD",
            fetchMaxRecords: 999,
            type: "hxgn.api.dialog.QueryParameters"
        };
        Log.info(`${thisMethod} -- getting work packages record set: ${workPackagesQueryRecordsPath}`);
        const workPackagesQueryRecordsJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), workPackagesQueryRecordsPath, workPackagesQueryParameters);
        if (workPackagesQueryRecordsJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting records: ${workPackagesQueryRecordsJcr.statusCode} ${JSON.stringify(workPackagesQueryRecordsJcr.value)}`);
        }
        const workPackagesQueryRecordSetVisitor = new RecordSetVisitor(workPackagesQueryRecordsJcr.value);
        // ***** Synchronize work packages *****
        for (const workPackageId of this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds()) {
            Log.info(`${thisMethod} -- synchronizing selected work package: ${workPackageId}`);
            const workPackageIdEncoded = Base64.encodeUrlSafeString(workPackageId);
            Log.info(`${thisMethod} -- synchronizing selected work package encoded id: ${workPackageIdEncoded}`);
            const createCommentActionSignature = `${this.delegateUserId()}.${pathFields.tenantId}.Workpackage_Documents_Documents@${workPackageIdEncoded}.alias_CreateComment`;
            const allKeys = await storage.getAllKeys();
            for (const k of allKeys) {
                if (k.startsWith(createCommentActionSignature)) {
                    Log.info(`${thisMethod} -- create comment activity exists for work package: ${workPackageId}`);
                    const dialogRedirectionJsonObject = await storage.getJson(k);
                    const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJsonObject);
                    Log.info(`${thisMethod} -- create comment activity exists for work package: ${workPackageId} at redirection: ${dialogRedirectionVisitor.copyAsJsonString()}`);
                    const dialogId = dialogRedirectionVisitor.visitDialogId();
                    Log.info(`${thisMethod} -- create comment activity exists for work package: ${workPackageId} at dialog id: ${dialogId}`);
                    const documentId = dialogRedirectionVisitor.visitRecordId();
                    Log.info(`${thisMethod} -- create comment activity exists for work package: ${workPackageId} at document id: ${documentId}`);
                    const dialogIdAndSuffix = dialogId.split('$');
                    const suffix = dialogIdAndSuffix[1];
                    Log.info(`${thisMethod} -- create comment activity exists for work package: ${workPackageId} at suffix: ${suffix}`);
                    const recordCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.recordcommit`;
                    const recordCommitJsonObject = await storage.getJson(recordCommitKey);
                    if (recordCommitJsonObject) {
                        Log.info(`${thisMethod} -- committed comment exists for work package: ${JSON.stringify(recordCommitJsonObject)}`);
                        // ***** Navigate work package into documents *****
                        const documentsMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${workPackagesListDialogVisitor.visitId()}/actions/alias_Open`;
                        const documentsMenuActionParameters = {
                            targets: [workPackageId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- getting documents redirection: ${documentsMenuActionPath}`);
                        const documentsDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), documentsMenuActionPath, documentsMenuActionParameters);
                        if (documentsDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for documents: ${documentsDialogRedirectionJcr.statusCode} ${JSON.stringify(documentsDialogRedirectionJcr.value)}`);
                        }
                        const documentsRedirectionVisitor = new DialogRedirectionVisitor(documentsDialogRedirectionJcr.value);
                        const documentsDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${documentsRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting documents dialog: ${documentsDialogPath}`);
                        const documentsDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), documentsDialogPath);
                        if (documentsDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting documents dialog: ${documentsDialogJcr.statusCode}`);
                        }
                        const documentsRootDialogVisitor = new DialogVisitor(documentsDialogJcr.value);
                        const documentsListDialogVisitor = documentsRootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
                        const createCommentMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${documentsListDialogVisitor.visitId()}/actions/alias_CreateComment`;
                        const createCommentMenuActionParameters = {
                            targets: [documentId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- opening a create comments dialog: ${createCommentMenuActionPath}`);
                        const createCommentDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), createCommentMenuActionPath, createCommentMenuActionParameters);
                        if (createCommentDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for create comment: ${createCommentDialogRedirectionJcr.statusCode} ${JSON.stringify(createCommentDialogRedirectionJcr.value)}`);
                        }
                        const createCommentDialogRedirectionVisitor = new DialogRedirectionVisitor(createCommentDialogRedirectionJcr.value);
                        const createCommentDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting create comment dialog: ${createCommentMenuActionPath}`);
                        const createCommentDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), createCommentDialogPath);
                        if (createCommentDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting create comment dialog: ${createCommentDialogJcr.statusCode} ${JSON.stringify(createCommentDialogJcr.value)}`);
                        }
                        const propertyCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.propertycommit$P_IMAGE`;
                        const propertyCommitJsonObject = await storage.getJson(propertyCommitKey);
                        if (propertyCommitJsonObject) {
                            const commitCreateCommentPropertyPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record/P_IMAGE`;
                            for (const writeLargeProperty of propertyCommitJsonObject) {
                                Log.info(`${thisMethod} -- committing create comment large property: ${commitCreateCommentPropertyPath}`);
                                const commitCreateCommentPropertyJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentPropertyPath, writeLargeProperty);
                                if (commitCreateCommentPropertyJcr.statusCode !== 200) {
                                    Log.error(`Unexpected result when committing create comment large property: ${commitCreateCommentPropertyJcr.statusCode} ${JSON.stringify(commitCreateCommentPropertyJcr.value)}`);
                                    break;
                                }
                            }
                        }
                        const commitCreateCommentRecordPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record`;
                        Log.info(`${thisMethod} -- committing create comment: ${commitCreateCommentRecordPath}`);
                        const commitCreateCommentRecordJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentRecordPath, recordCommitJsonObject);
                        Log.info(`${thisMethod} -- commit create comment result: ${commitCreateCommentRecordJcr.statusCode} ${JSON.stringify(commitCreateCommentRecordJcr.value)}`);
                    }
                }
            }
        }
        // TODO: Clear transactions
        this._dialogDelegateStateVisitor.visitAndClearSelectedWorkPackageIds();
        this._dialogDelegateStateVisitor.visitMobileCommentsRecordSet().visitAndClearRecords();
        this.delegateWorkPackagesRecordSetVisitor().visitAndClearRecords();
        this.delegateBriefcaseVisitor().visitAndSetOnline(true);
        await SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor);
        const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
        return new JsonClientResponse(nullRedirection, 303);
    }

    private performOfflineBriefcaseCommentsRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const response = this._dialogDelegateStateVisitor.visitMobileCommentsRecordSet().enclosedJsonObject();
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private performOfflineBriefcaseWorkPackagesRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        for (const id of this.delegateSelectedWorkPackageIds()) {
            const workPackageVisitor = this.delegateWorkPackagesRecordSetVisitor().visitRecordAtId(id);
            if (workPackageVisitor) {
                RecordSetVisitor.addOrUpdateRecord(response, SelectedWorkPackageVisitor.createFromWorkPackageVisitor(workPackageVisitor));
            } else {
                Log.warn(`${thisMethod} -- WARNING: Selected work package not found: ${id}`);
            }
        }
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private async performOfflineCreateCommentMenuAction(request: DialogRequest): Promise<JsonClientResponse> {
        const actionParameters = new ActionParametersVisitor(request.body());
        const recordId = actionParameters.visitTargetsValue()[0];
        const recordIdEncoded = Base64.encodeUrlSafeString(recordId);
        const createCommentRedirectionVisitor = new DialogRedirectionVisitor(Documents_CreateComment_FORM_REDIRECTION.copyOfResponse());
        createCommentRedirectionVisitor.propagateTenantIdAndSessionId(request.tenantId(), request.sessionId());
        createCommentRedirectionVisitor.visitAndSetReferringDialogId(request.dialogId());
        createCommentRedirectionVisitor.visitAndSetRecordId(recordId);
        // Derive the dialog ids based on the current time in millis
        const timeInMillis = Date.now().toString();
        createCommentRedirectionVisitor.deriveDialogIdsFromDialogNameAndSuffix(timeInMillis);
        const actionIdAtRecordId = `${request.actionId()}@${recordIdEncoded}`;
        await DialogProxyTools.writeDialogRedirection(this.delegateUserId(), request.tenantId(), request.dialogId(), actionIdAtRecordId, createCommentRedirectionVisitor);
        const createCommentDialogVisitor = new DialogVisitor(Documents_CreateComment_FORM.copyOfResponse());
        createCommentDialogVisitor.propagateTenantIdAndSessionId(request.tenantId(), request.sessionId());
        createCommentDialogVisitor.deriveDialogIdsFromDialogNameAndSuffix(timeInMillis);
        createCommentDialogVisitor.visitAndSetRecordId(recordId);
        await DialogProxyTools.writeDialog(this.delegateUserId(), request.tenantId(), createCommentDialogVisitor);
        const createCommentRecordVisitor = new RecordVisitor(Documents_CreateComment_RECORD.copyOfResponse());
        // Visit the only child, which will be the properties editor
        const propertiesDialogVisitor = createCommentDialogVisitor.visitChildAt(0);
        await DialogProxyTools.writeRecord(this.delegateUserId(), request.tenantId(), propertiesDialogVisitor.visitId(), createCommentRecordVisitor);
        return new JsonClientResponse(createCommentRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private async performOfflineDocumentsPropertiesRecordRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructGetRecordPath();
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineDocumentsPropertiesRecord(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineShowDocsMenuAction(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        // tenants/${tenantId}/sessions/${sessionId}/dialogs/Workpackage_Tags_Tags@eyJDIjoiJzZHVzcwMDBBJyIsIk4iOiJXb3JrcGFja2FnZXMoSWQ9JzZHVzcwMDBBJykifQ==/actions/alias_ShowDocs
        const fromDialogIdAndRecordId = pathFields.dialogId.split('@');
        // glenn.hexagonsdaop.Workpackage_General.alias_Open@eyJDIjoiJzZHVzcwMDBBJyIsIk4iOiJXb3JrcGFja2FnZXMoSWQ9JzZHVzcwMDBBJykifQ==.redirection
        const actionId = 'alias_Open@' + fromDialogIdAndRecordId[1];
        const dialogRedirectionVisitor = await DialogProxyTools.readDialogRedirectionAsVisitor(this.delegateUserId(), pathFields.tenantId, 'Workpackage_General', actionId);
        if (!dialogRedirectionVisitor) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode('postJson', request.resourcePath());
        }
        dialogRedirectionVisitor.visitAndSetReferringDialogMode('DESTROYED');
        return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private async performOfflineTagsPropertiesRecordRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructGetRecordPath();
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineTagsPropertiesRecord(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    private performWorkPackagesAddWorkPackageToBriefcase(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performWorkPackagesAddWorkPackageToBriefcase';
        // REQUIRED: Before we can add a Work Package to the briefcase, we must be online
        if (!this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Cannot add a Work Package to the briefcase while offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const targets = ActionParametersVisitor.visitTargetsValue(request.body());
        if (targets && targets.length > 0) {
            for (const t of targets) {
                Log.info(`${thisMethod} -- adding selected work package id: ${t}`);
                this._dialogDelegateStateVisitor.addSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = request.deconstructPostMenuActionPath();
        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructAddToBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

    private performWorkPackagesRemoveWorkPackageFromBriefcase(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performWorkPackagesRemoveWorkPackageFromBriefcase';
        // REQUIRED: Before we can remove a Work Package from the briefcase, we must be online
        if (!this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Cannot remove a Work Package from the briefcase while offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const targets = ActionParametersVisitor.visitTargetsValue(request.body());
        if (targets && targets.length > 0) {
            for (const t of targets) {
                Log.info(`${thisMethod} -- removing selected work package id: ${t}`);
                this._dialogDelegateStateVisitor.removeSelectedWorkPackageId(targets[0]);
            }
        }
        const pathFields = request.deconstructPostMenuActionPath();
        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
            return new JsonClientResponse(SdaDialogDelegateTools.constructRemoveFromBriefcaseNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId), 303);
        });
    }

}
