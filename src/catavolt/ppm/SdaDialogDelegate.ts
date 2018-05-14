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
import {SessionVisitor} from "../proxy/SessionVisitor";
import {ValueIterator} from "../proxy/ValueIterator";
import {Base64} from "../util/Base64";
import {Log} from '../util/Log';
import {StringDictionary} from '../util/StringDictionary';
import {BriefcaseVisitor} from "./BriefcaseVisitor";
import {Briefcase_Briefcase_FORM} from "./samples/Briefcase_Briefcase_FORM";
import {Briefcase_Briefcase_FORM_REDIRECTION} from "./samples/Briefcase_Briefcase_FORM_REDIRECTION";
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
            if (SdaDialogDelegateTools.isOfflineDocumentsRootDialogRequest(request)) {
//                return this.performOfflineDocumentsRootDialogRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineTagsRootDialogRequest(request)) {
//                return this.performOfflineTagsRootDialogRequest(request);
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
                return DialogProxyTools.readMenuActionRedirectionAsOfflineResponse(this.delegateUserId(), request);
            } else if (request.isPostRecordsPath()) {
                return DialogProxyTools.readRecordSetAsOfflineResponse(this.delegateUserId(), request);
            } else if (request.isPostSessionContentPath()) {
                return DialogProxyTools.readSessionContentAsOfflineResponse(this.delegateUserId(), request);
            }

            if (SdaDialogDelegateTools.isOfflineWorkPackagesOpenMenuActionRequest(request)) {
                return this.performOfflineWorkPackagesOpenMenuActionRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineDocumentsListRecordSetRequest(request)) {
                return this.performOfflineDocumentsListRecordSetRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineDocumentOpenLatestFileMenuActionRequest(request)) {
                return this.performOfflineDocumentOpenLatestFileMenuActionRequest(request);
            // } else if (SdaDialogDelegateTools.isOfflineDocumentContentRequest(request)) {
            //     return this.performOfflineDocumentContentRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineShowTagsMenuActionRequest(request)) {
                return this.performOfflineShowTagsMenuActionRequest(request);
            } else if (SdaDialogDelegateTools.isOfflineTagsListRecordSetRequest(request)) {
                return this.performOfflineTagsListRecordSetRequest(request);
            }
            return Promise.resolve(DialogProxyTools.constructRequestNotValidDuringOfflineMode('postJson', request.resourcePath()));
        }
        return null;
    }

    public putJson(request: DialogRequest): Promise<JsonClientResponse> | null {
        Log.info("SdaDialogDelegate::putJson -- path: " + request.resourcePath());
        Log.info("SdaDialogDelegate::putJson -- body: " + JSON.stringify(request.body()));
        if (!this.delegateOnline()) {
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
                    return this.initializeAfterCreateSession(request, new SessionVisitor(jsonObject)).then(voidValue => jsonClientResponse);
                } else if (SdaDialogDelegateTools.isWorkPackagesListRecordSet(request, jsonObject)) {
                    if (this.delegateOnline()) {
                        const pathFields = request.deconstructPostRecordsPath();
                        const workPackagesRecordSetVisitor = new WorkPackagesRecordSetVisitor(jsonObject);
                        workPackagesRecordSetVisitor.updateBriefcaseColumnUsingSelections(this.delegateSelectedWorkPackageIds());
                        this.delegateWorkPackagesRecordSetVisitor().addOrUpdateAllRecords(workPackagesRecordSetVisitor);
                        return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(voidValue => {
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
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, onlineWorkPackagesListDialogId, 'alias_Open', nextWorkPackageId);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_PROPERTIES_DIALOG_NAME);
        const documentsRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const beforeDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const afterDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        for (const r of documentsRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineDocumentContent(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, r);
        }
//        await this.captureNextOfflineTags(onlineListDialogId, offlineListDialogId, nextWorkPackageId, tenantId, sessionId);
        return null;
    }

    private async captureNextOfflineTags(onlineDocumentsListDialogId: string, offlineDocumentsListDialogId: string, nextWorkPackageId: string, tenantId: string, sessionId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineTags';
        // GET REDIRECTION //
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineDocumentsListDialogId}/actions/alias_ShowTags`;
        const redirectionParameters = {
            targets: [],
            type: "hxgn.api.dialog.ActionParameters"
        };
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), redirectionPath, redirectionParameters);
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening Tags at dialog: ${onlineDocumentsListDialogId}`);
        }
        Log.info(`${thisMethod} -- tags redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const onlineRootDialogId = dialogRedirectionVisitor.visitDialogId();
        dialogRedirectionVisitor.propagateDialogId(SdaDialogDelegateTools.getOfflineTagsDialogRootId(nextWorkPackageId));
        await SdaDialogDelegateTools.writeOfflineTagsRedirection(tenantId, this.delegateUserId(), nextWorkPackageId, dialogRedirectionVisitor);
        Log.info(`${thisMethod} -- work package tags redirection written successfully: ${nextWorkPackageId}`);
        // GET DIALOG //
        const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineRootDialogId}`;
        const rootDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this._dialogDelegateStateVisitor.visitBaseUrl(), dialogPath);
        if (rootDialogJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting dialog for WorkPackage tags ${nextWorkPackageId}: ${rootDialogJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- tags dialog: ${JSON.stringify(rootDialogJcr.value)}`);
        const rootDialogVisitor = new DialogVisitor(rootDialogJcr.value);
        // Capture online list dialog id before changing it to an offline id
        const propertiesDialogVisitor = rootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME);
        const onlinePropertiesDialogId = propertiesDialogVisitor.visitId();
        const listDialogVisitor = rootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const onlineListDialogId = listDialogVisitor.visitId();
        // Change dialog ids to well-known offline ids
        rootDialogVisitor.visitAndSetId(SdaDialogDelegateTools.getOfflineTagsDialogRootId(nextWorkPackageId));
        rootDialogVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME, SdaDialogDelegateTools.getOfflineTagsDialogPropertiesId(nextWorkPackageId));
        const offlineListDialogId = SdaDialogDelegateTools.getOfflineTagsDialogListId(nextWorkPackageId);
        rootDialogVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME, offlineListDialogId);
        await SdaDialogDelegateTools.writeOfflineTagsDialogRoot(tenantId, this.delegateUserId(), nextWorkPackageId, rootDialogVisitor);
        // GET PROPERTIES RECORD //
        const propertiesPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlinePropertiesDialogId}/record`;
        const propertiesRecordJcr = await DialogProxyTools.commonFetchClient().getJson(this._dialogDelegateStateVisitor.visitBaseUrl(), propertiesPath);
        if (propertiesRecordJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting properties record for WorkPackage tags ${nextWorkPackageId}: ${rootDialogJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- work package tags properties record: ${JSON.stringify(propertiesRecordJcr.value)}`);
        const propertiesRecordVisitor = new RecordVisitor(propertiesRecordJcr.value);
        await SdaDialogDelegateTools.writeOfflineTagsDialogPropertiesRecord(tenantId, this.delegateUserId(), nextWorkPackageId, propertiesRecordVisitor);
        // GET LIST RECORD SET //
        const listPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineListDialogId}/records`;
        const listParameters = {
            fetchDirection: "FORWARD",
            fetchMaxRecords: 500,
            type: "hxgn.api.dialog.QueryParameters"
        };
        const listRecordSetJcr = await DialogProxyTools.commonFetchClient().postJson(this._dialogDelegateStateVisitor.visitBaseUrl(), listPath, listParameters);
        const listRecordSetVisitor = new RecordSetVisitor(listRecordSetJcr.value);
        await SdaDialogDelegateTools.writeOfflineTagsDialogListRecordSet(tenantId, this.delegateUserId(), nextWorkPackageId, listRecordSetVisitor);
    }

    private async captureNextOfflineDocumentContent(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialgog: DialogVisitor, nextDocumentRecordVisitor: RecordVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineDocumentContent';
        const onlineDocumentsListDialogId = beforeDocumentsListDialog.visitId();
        const offlineDocumentsListDialogId = afterDocumentsListDialgog.visitId();
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

    private initializeAfterCreateSession(request: DialogRequest, sessionVisitor: SessionVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = request.deconstructPostSessionsPath();
        return Promise.resolve().then(voidValue => {
            Log.info(`${thisMethod} -- showing storage keys`);
            return SdaDialogDelegateTools.showAllStorageKeys();
        }).then(voidValue => {
            return SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        }).then(dialogDelegateStateVisitor => {
            Log.info(`${thisMethod} -- dialog delegate state before initializing: ${dialogDelegateStateVisitor.copyAsJsonString()}`);
            Log.info(`${thisMethod} -- selected work packages count: ${dialogDelegateStateVisitor.visitSelectedWorkPackageIds().length}`);
            const loginVisitor = new LoginVisitor(request.body());
            dialogDelegateStateVisitor.visitAndSetBaseUrl(request.baseUrl());
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

    private performExitOfflineModeMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        if (this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already online");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = request.deconstructPostMenuActionPath();
        return this.performLoginForOnlineProcessing(pathFields.tenantId).then(sessionJcr => {
            if (sessionJcr.statusCode !== 200) {
                return sessionJcr;
            }
            this._dialogDelegateStateVisitor.visitAndClearSelectedWorkPackageIds();
            this.delegateWorkPackagesRecordSetVisitor().visitAndClearRecords();
            this.delegateBriefcaseVisitor().visitAndSetOnline(true);
            return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue => {
                const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
                return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
            });
        });
    }

    private performOfflineBriefcaseCommentsRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
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

    // private async performOfflineDocumentContentRequest(request: DialogRequest): Promise<JsonClientResponse> {
    //     const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
    //     const pathFields = request.deconstructPostSessionContentPath();
    //     const sequence = ReadLargePropertyParametersVisitor.visitSequence(request.body());
    //     const largePropertyVisitor = await SdaDialogDelegateTools.readOfflineDocumentContentChunk(pathFields.tenantId, this.delegateUserId(), pathFields.contentId, sequence);
    //     return new JsonClientResponse(largePropertyVisitor.enclosedJsonObject(), 200);
    // }

    private async performOfflineDocumentOpenLatestFileMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        const actionParameters = ActionParametersVisitor.visitTargetsValue(request.body());
        if (actionParameters.length !== 1) {
            return new JsonClientResponse(DialogProxyTools.constructDialogMessageModel('A single selection is required'), 400);
        }
        const documentId = actionParameters[0];
        const contentRedirectionVisitor = await SdaDialogDelegateTools.readOfflineDocumentContentRedirection(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId, documentId);
        return new JsonClientResponse(contentRedirectionVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentsListRecordSetRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostRecordsPath();
        const listRecordSetVisitor = await SdaDialogDelegateTools.readOfflineDocumentsListRecordSet(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(listRecordSetVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentsPropertiesRecordRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructGetRecordPath();
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineDocumentsPropertiesRecord(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    // private async performOfflineDocumentsRootDialogRequest(request: DialogRequest): Promise<JsonClientResponse> {
    //     const pathFields = request.deconstructGetDialogPath();
    //     const rootDialogVisitor = await SdaDialogDelegateTools.readOfflineDocumentsRootDialog(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
    //     return new JsonClientResponse(rootDialogVisitor.enclosedJsonObject(), 200);
    // }

    private async performOfflineShowTagsMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        // HACK: Get work package id from dialog id
        // const actionParameters = ActionParametersVisitor.visitTargetsValue(body);
        // const workPackageId = actionParameters[0];
        const splitElems = pathFields.dialogId.split('_');
        const workPackageId = splitElems[3];
        const dialogRedirectionVisitor = await SdaDialogDelegateTools.readOfflineTagsRedirection(pathFields.tenantId, this.delegateUserId(), workPackageId);
        return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private async performOfflineTagsListRecordSetRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostRecordsPath();
        const listRecordSetVisitor = await SdaDialogDelegateTools.readOfflineTagsListRecordSet(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(listRecordSetVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineTagsPropertiesRecordRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructGetRecordPath();
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineTagsPropertiesRecord(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    // private async performOfflineTagsRootDialogRequest(request: DialogRequest): Promise<JsonClientResponse> {
    //     const pathFields = request.deconstructGetDialogPath();
    //     const rootDialogVisitor = await SdaDialogDelegateTools.readOfflineTagsRootDialog(pathFields.tenantId, this.delegateUserId(), pathFields.dialogId);
    //     return new JsonClientResponse(rootDialogVisitor.enclosedJsonObject(), 200);
    // }

    private async performOfflineWorkPackagesOpenMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        const actionParameters = ActionParametersVisitor.visitTargetsValue(request.body());
        if (actionParameters.length !== 1) {
            return new JsonClientResponse(DialogProxyTools.constructDialogMessageModel('A single selection is required'), 400);
        }
        const workPackageId = actionParameters[0];
        const dialogRedirectionVisitor = await SdaDialogDelegateTools.readOfflineDocumentsRedirection(pathFields.tenantId, this.delegateUserId(), workPackageId);
        return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
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
