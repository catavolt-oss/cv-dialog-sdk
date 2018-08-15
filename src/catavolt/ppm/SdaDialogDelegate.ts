import {BlobClientResponse} from "../client/BlobClientResponse";
import {ClientEvent} from "../client/ClientEvent";
import {ClientEventType} from "../client/ClientEventType";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from '../io/StreamProducer';
import {ActionParametersVisitor} from "../proxy/ActionParametersVisitor";
import {ContentRedirectionVisitor} from "../proxy/ContentRedirectionVisitor";
import {DialogDelegate} from "../proxy/DialogDelegate";
import {DialogProxy} from "../proxy/DialogProxy";
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
import {Briefcase_EnterOfflineMode_FORM} from "./samples/Briefcase_EnterOfflineMode_FORM";
import {Briefcase_EnterOfflineMode_RECORD} from "./samples/Briefcase_EnterOfflineMode_RECORD";
import {Briefcase_EnterOfflineMode_REDIRECTION} from "./samples/Briefcase_EnterOfflineMode_REDIRECTION";
import {Documents_CreateComment_FORM} from "./samples/Documents_CreateComment_FORM";
import {Documents_CreateComment_FORM_REDIRECTION} from "./samples/Documents_CreateComment_FORM_REDIRECTION";
import {Documents_CreateComment_RECORD} from "./samples/Documents_CreateComment_RECORD";
import {MobileComment_Details_FORM} from "./samples/MobileComment_Details_FORM";
import {MobileComment_Details_FORM_REDIRECTION} from "./samples/MobileComment_Details_FORM_REDIRECTION";
import {MobileComment_Details_RECORD} from "./samples/MobileComment_Details_RECORD";
import {MobileComment_ImageNotAvailable_FORM} from "./samples/MobileComment_ImageNotAvailable_FORM";
import {MobileComment_ImageNotAvailable_FORM_REDIRECTION} from "./samples/MobileComment_ImageNotAvailable_FORM_REDIRECTION";
import {MobileComment_ImageNotAvailable_RECORD} from "./samples/MobileComment_ImageNotAvailable_RECORD";
import {SdaPostWorkPackagesRecords1JsonSample} from "./samples/SdaPostWorkPackagesRecords1JsonSample";
import {SdaDialogDelegateStateVisitor} from "./SdaDialogDelegateStateVisitor";
import {SdaDialogDelegateTools} from "./SdaDialogDelegateTools";
import {SelectedWorkPackageVisitor} from "./SelectedWorkPackageVisitor";
import {WorkPackagesRecordSetVisitor} from "./WorkPackagesRecordSetVisitor";

export class SdaDialogDelegate implements DialogDelegate {

    private static ALIAS_CREATE_COMMENT_MENU_ACTION_ID = 'alias_CreateComment';
    private static ALIAS_OPEN_MENU_ACTION_ID = 'alias_Open';
    private static ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID = 'alias_OpenLatestFile';
    private static ALIAS_SHOW_LATEST_MENU_ACTION_ID = 'alias_ShowLatest';
    private static ALIAS_SHOW_TAGS_MENU_ACTION_ID = 'alias_ShowTags';
    private static OPEN_MENU_ACTION_ID = 'open';

    private _dialogProxy: DialogProxy;
    private _dialogDelegateStateVisitor: SdaDialogDelegateStateVisitor = null;

    public initialize(dialogProxy: DialogProxy): Promise<void> {
        Log.info("SdaDialogDelegate::initialize -- setting dialog proxy");
        this._dialogProxy = dialogProxy;
        return Promise.resolve();
    }

    public async isAnyUserInBriefcaseMode(tenantId: string): Promise<boolean> {
        const dialogDelegateStateKeys: string[] = await SdaDialogDelegateTools.readDialogDelegateStateKeys(tenantId);
        for (const k of dialogDelegateStateKeys) {
            const fields: string[] = k.split('.');
            const userId = fields[0];
            if (await this.isUserInBriefcaseMode({userId, tenantId})) {
                return true;
            }
        }
    }

    public async isUserInBriefcaseMode(userInfo: {}): Promise<boolean> {
        Log.info(`SdaDialogDelegate::isUserInBriefcaseMode userInfo -- ${JSON.stringify(userInfo)}`);
        const userId = userInfo['userId'];
        const tenantId = userInfo['tenantId'];
        const dialogDelegateStateVisitor = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(tenantId, userId);
        return dialogDelegateStateVisitor &&
            dialogDelegateStateVisitor.visitBriefcase() &&
            !dialogDelegateStateVisitor.visitBriefcase().visitOnline();
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
            if (SdaDialogDelegateTools.isBriefcaseEnterOfflineDialogId(pathFields.dialogId)) {
                const response = Briefcase_EnterOfflineMode_FORM.copyOfResponse();
                const enterOfflineVisitor = new DialogVisitor(response);
                enterOfflineVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                enterOfflineVisitor.visitAndSetId(SdaDialogDelegateTools.BRIEFCASE_ENTER_OFFLINE_ROOT_DIALOG_ID);
                enterOfflineVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_ENTER_OFFLINE_DETAILS_DIALOG_NAME, SdaDialogDelegateTools.BRIEFCASE_ENTER_OFFLINE_DETAILS_DIALOG_ID);
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
            if (SdaDialogDelegateTools.isOfflineBriefcaseDialogId(pathFields.dialogId)) {
                const response = Briefcase_Briefcase_FORM.copyOfResponse();
                const briefcaseVisitor = new DialogVisitor(response);
                briefcaseVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                briefcaseVisitor.visitAndSetId(SdaDialogDelegateTools.BRIEFCASE_ROOT_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_DETAILS_DIALOG_NAME, SdaDialogDelegateTools.BRIEFCASE_DETAILS_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_WORK_PACKAGES_DIALOG_NAME, SdaDialogDelegateTools.BRIEFCASE_WORK_PACKAGES_DIALOG_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME, SdaDialogDelegateTools.BRIEFCASE_COMMENTS_DIALOG_ID);
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        } else if (request.isGetRecordPath()) {
            const pathFields = request.deconstructGetRecordPath();
            if (SdaDialogDelegateTools.isBriefcaseEnterOfflineDetailsDialogId(pathFields.dialogId)) {
                const response = Briefcase_EnterOfflineMode_RECORD.copyOfResponse();
                const recordVisitor = new RecordVisitor(response);
                recordVisitor.visitAndSetPropertyValueAt('P_USERID', this.delegateUserId());
                return Promise.resolve(new JsonClientResponse(recordVisitor.enclosedJsonObject(), 200));
            }
            if (SdaDialogDelegateTools.isOfflineBriefcaseDetailsDialogId(pathFields.dialogId)) {
                const response = this.delegateBriefcaseVisitor().enclosedJsonObject();
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
            if (SdaDialogDelegateTools.isOfflineDocumentsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineDocumentsPropertiesRecordRequest(request);
            }
            if (SdaDialogDelegateTools.isOfflineTagsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineTagsPropertiesRecordRequest(request);
            }
            if (pathFields.dialogId === SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_ID) {
                const recordJson = MobileComment_ImageNotAvailable_RECORD.copyOfResponse();
                return Promise.resolve(new JsonClientResponse(recordJson, 200));
            }
        }
        if (!this.delegateOnline()) {
            if (request.isGetDialogPath()) {
                const pathFields = request.deconstructGetDialogPath();
                if (pathFields.dialogId === SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_ROOT_DIALOG_ID) {
                    const dialogJson = MobileComment_ImageNotAvailable_FORM.copyOfResponse();
                    const dialogVisitor = new DialogVisitor(dialogJson);
                    dialogVisitor.visitAndSetId(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_ROOT_DIALOG_ID);
                    dialogVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                    dialogVisitor.visitChildAtName(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_NAME).visitAndSetId(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_ID);
                    dialogVisitor.visitChildAtName(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_NAME).visitAndSetRootDialogId(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_ROOT_DIALOG_ID);
                    return Promise.resolve(new JsonClientResponse(dialogJson, 200));
                }
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
                } else if (request.actionId() === SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID) {
                    return this.performOfflineCreateCommentMenuAction(request);
                } else if (request.actionId() === SdaDialogDelegate.ALIAS_SHOW_LATEST_MENU_ACTION_ID) {
                    return this.performOfflineShowLatestMenuAction(request);
                } else if (request.actionId() === SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID) {
                    return DialogProxyTools.readMenuActionRedirectionAsVisitor(this.delegateUserId(), request).then(dialogRedirectionVisitor => {
                        if (dialogRedirectionVisitor) {
                            return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
                        } else {
                            // return new JsonClientResponse(DialogProxyTools.constructDialogMessageModel('Latest file not found'), 400);
                            const pathFields = request.deconstructPostMenuActionPath();
                            const dialogRedirection = MobileComment_ImageNotAvailable_FORM_REDIRECTION.copyOfResponse();
                            DialogRedirectionVisitor.propagateDialogId(dialogRedirection, SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_ROOT_DIALOG_ID);
                            DialogRedirectionVisitor.propagateTenantIdAndSessionId(dialogRedirection, pathFields.tenantId, pathFields.sessionId);
                            return new JsonClientResponse(dialogRedirection, 303);
                        }
                    });
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
        if (request.isPutViewModePath()) {
            const pathFields = request.deconstructPutViewModePath();
            if (SdaDialogDelegateTools.isBriefcaseEnterOfflineDetailsDialogId(pathFields.dialogId) && pathFields.viewMode === 'READ') {
                return Promise.resolve(new JsonClientResponse(SdaDialogDelegateTools.constructBriefcaseEnterOfflineDetailsNullRedirection(pathFields.tenantId, pathFields.sessionId, false), 303));
            }
        }
        if (request.isPutRecordPath()) {
            const pathFields = request.deconstructPostRecordsPath();
            if (SdaDialogDelegateTools.isBriefcaseEnterOfflineDetailsDialogId(pathFields.dialogId)) {
                const recordVisitor = new RecordVisitor(request.body());
                const loginHash = SdaDialogDelegateTools.createOfflineLoginHash(pathFields.tenantId, pathFields.sessionId, this.delegateUserId(), recordVisitor.visitPropertyValueAt('P_PASSWORD'));
                Log.info("SdaDialogDelegate::putJson -- loginHash: " + loginHash);
                this._dialogDelegateStateVisitor.visitAndSetLoginHash(loginHash);
                return this.performEnterOfflineModeContinueRequest(request.baseUrl(), pathFields.tenantId, pathFields.sessionId);
            }
        }
        if (!this.delegateOnline()) {
            if (request.isPutViewModePath()) {
                const pathFields = request.deconstructPutViewModePath();
                if (pathFields.dialogId.startsWith('Documents_CreateComment$') && pathFields.viewMode === 'READ') {
                    return Promise.resolve(this.constructCreateCommentNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId));
                }
                if (pathFields.dialogId === SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_ID) {
                    const nullRedirection = DialogProxyTools.constructNullRedirection(pathFields.tenantId, pathFields.sessionId);
                    const nullRedirectionVisitor = new RedirectionVisitor(nullRedirection);
                    nullRedirectionVisitor.visitAndSetReferringDialogAlias(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_NAME);
                    nullRedirectionVisitor.visitAndSetReferringDialogName(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_NAME);
                    nullRedirectionVisitor.visitAndSetReferringDialogId(SdaDialogDelegateTools.MOBILE_COMMENT_IMAGE_NOT_AVAILABLE_DETAILS_DIALOG_ID);
                    nullRedirectionVisitor.visitAndSetReferringDialogMode('DESTROYED');
                    return Promise.resolve(new JsonClientResponse(nullRedirectionVisitor.enclosedJsonObject(), 303));
                }
                return null;
            }
            if (request.isPutRecordPath()) {
                const pathFields = request.deconstructPutRecordPath();
                const recordVisitor = new RecordVisitor(request.body());
                return DialogProxyTools.writeRecordCommit(this.delegateUserId(), pathFields.tenantId, pathFields.dialogId, recordVisitor).then(nullValue => {
                    this._dialogDelegateStateVisitor.visitMobileCommentsRecordSet().acceptCreateComment(pathFields.dialogId, recordVisitor);
                    return SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor).then(nullValue2 => {
                        return this.constructCreateCommentNullRedirection(pathFields.tenantId, pathFields.sessionId, pathFields.dialogId);
                    });
                });
            }
            if (request.isPutPropertyPath()) {
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
        // Whether online or offline, we need to short-circuit the deletion of briefcase dialogs. The briefcase dialogs
        // are 100% client-side only and are synthesized for each use.
        if (request.isDeleteDialogPath() && SdaDialogDelegateTools.startsWithBriefcaseRootDialogId(request.dialogId())) {
            const response = {
                "dialogId": request.dialogId(),
                "type": "hxgn.api.dialog.DialogId"
            };
            return Promise.resolve(new JsonClientResponse(response, 200));
        }
        if (!this.delegateOnline()) {
            const pathFields = request.deconstructDeleteDialogPath();
            if (request.isDeleteDialogPath()) {
                const response = {
                    "dialogId": pathFields.dialogId,
                    "type": "hxgn.api.dialog.DialogId"
                };
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
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
        const thisMethod = 'SdaDialogDelegate::handlePutJsonResponse';
        Log.info("SdaDialogDelegate::handlePutJsonResponse -- path: " + request.resourcePath());
        response.then(jcr => Log.info(`${thisMethod} -- json response:  ${JSON.stringify(jcr.statusCode)} ${JSON.stringify(jcr.value)}`));
        return response;
    }

    // --- Others --- //

    private async captureOfflineSession(baseUrl: string, tenantId: string, sessionId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineSession';
        this.notifyClientListener({message: 'Capturing session for offline', eventType: ClientEventType.MESSAGE});
        const resourcePath = `tenants/${tenantId}/sessions/${sessionId}`;
        const sessionJcr = await DialogProxyTools.commonFetchClient().getJson(baseUrl, resourcePath);
        Log.info(`${thisMethod} -- session value: ${JSON.stringify(sessionJcr.value)}`);
        const sessionVisitor = new SessionVisitor(sessionJcr.value);
        await SdaDialogDelegateTools.writeOfflineSession(tenantId, this.delegateUserId(), sessionVisitor);
        return sessionJcr;
    }

    private async captureNextOfflineWorkPackage(baseUrl: string, tenantId: string, sessionId: string, onlineWorkPackagesListDialogId: string, offlineWorkPackagesListDialogId: string, nextWorkPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineWorkPackage';
        Log.info(`${thisMethod} -- capturing work package for offline: ${nextWorkPackageId}`);
        this.notifyClientListener({
            message: `Capturing work package: ${nextWorkPackageId}`,
            eventType: ClientEventType.MESSAGE
        });
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, onlineWorkPackagesListDialogId, offlineWorkPackagesListDialogId, SdaDialogDelegate.ALIAS_OPEN_MENU_ACTION_ID, nextWorkPackageId);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_PROPERTIES_DIALOG_NAME);
        const documentsRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const beforeDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const afterDocumentsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        for (const r of documentsRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineDocumentContent(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, r);
            await this.captureNextOfflineLastComment(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, r);
        }
        await this.captureNextOfflineTags(baseUrl, tenantId, sessionId, beforeDocumentsListDialog, afterDocumentsListDialog, nextWorkPackageId);
        return null;
    }

    private async captureNextOfflineTags(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialog: DialogVisitor, nextWorkPackageId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineTags';
        Log.info(`${thisMethod} -- capturing tags for offline: ${nextWorkPackageId}`);
        this.notifyClientListener({
            message: `Capturing tags: ${nextWorkPackageId}`,
            eventType: ClientEventType.MESSAGE
        });
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeDocumentsListDialog.visitId(), afterDocumentsListDialog.visitId(), SdaDialogDelegate.ALIAS_SHOW_TAGS_MENU_ACTION_ID, null);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME);
        const tagsRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const beforeTagsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const afterTagsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        for (const r of tagsRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineTag(baseUrl, tenantId, sessionId, beforeTagsListDialog, afterTagsListDialog, r);
            await this.captureNextOfflineLastComment(baseUrl, tenantId, sessionId, beforeTagsListDialog, afterTagsListDialog, r);
        }
        return null;
    }

    private async captureNextOfflineTag(baseUrl: string, tenantId: string, sessionId: string, beforeTagsListDialog: DialogVisitor, afterTagsListDialog: DialogVisitor, nextTagRecordVisitor: RecordVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineTag';
        const nextTagRecordId = nextTagRecordVisitor.visitRecordId();
        Log.info(`${thisMethod} -- capturing tag for offline: ${nextTagRecordId}`);
        this.notifyClientListener({
            message: `Capturing tag: ${nextTagRecordId}`,
            eventType: ClientEventType.MESSAGE
        });
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeTagsListDialog.visitId(), afterTagsListDialog.visitId(), SdaDialogDelegate.OPEN_MENU_ACTION_ID, nextTagRecordId);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAG_DETAILS_PROPERTIES_DIALOG_NAME);
        const tagDetailsListRecordSetVisitor = await DialogProxyTools.captureRecordSet(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.TAG_DETAILS_LIST_DIALOG_NAME);
        const beforeTagDetailsListDialog = (new DialogVisitor(beforeAndAfterValues.beforeDialog)).visitChildAtName(SdaDialogDelegateTools.TAG_DETAILS_LIST_DIALOG_NAME);
        const afterTagDetailsListDialog = (new DialogVisitor(beforeAndAfterValues.afterDialog)).visitChildAtName(SdaDialogDelegateTools.TAG_DETAILS_LIST_DIALOG_NAME);
        for (const r of tagDetailsListRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineDocumentContent(baseUrl, tenantId, sessionId, beforeTagDetailsListDialog, afterTagDetailsListDialog, r);
            await this.captureNextOfflineLastComment(baseUrl, tenantId, sessionId, beforeTagDetailsListDialog, afterTagDetailsListDialog, r);
        }
        return null;
    }

    private async captureNextOfflineDocumentContent(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialog: DialogVisitor, nextDocumentRecordVisitor: RecordVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineDocumentContent';
        const onlineDocumentsListDialogId = beforeDocumentsListDialog.visitId();
        const offlineDocumentsListDialogId = afterDocumentsListDialog.visitId();
        Log.info(`${thisMethod} -- online list dialog id: ${onlineDocumentsListDialogId}`);
        Log.info(`${thisMethod} -- offline list dialog id: ${offlineDocumentsListDialogId}`);
        // GET REDIRECTION //
        const nextDocumentId = nextDocumentRecordVisitor.visitRecordId();
        this.notifyClientListener({
            message: `Capturing document: ${nextDocumentId}`,
            eventType: ClientEventType.MESSAGE
        });
        const nextDocumentIdEncoded = Base64.encodeUrlSafeString(nextDocumentId);
        Log.info(`${thisMethod} -- next document id: ${nextDocumentId} encoded as: ${nextDocumentIdEncoded}`);
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineDocumentsListDialogId}/actions/${SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID}`;
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
        const offlineContentId = `content_redirection_${nextDocumentIdEncoded}`;
        contentRedirectionVisitor.visitAndSetId(offlineContentId);
        const actionIdAtRecordId = `${SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID}@${nextDocumentIdEncoded}`;
        await DialogProxyTools.writeContentRedirection(this.delegateUserId(), tenantId, offlineDocumentsListDialogId, actionIdAtRecordId, contentRedirectionVisitor);
        const largePropertyExists = await DialogProxyTools.readSessionContentAsVisitor(this.delegateUserId(), tenantId, offlineContentId, 0);
        if (largePropertyExists) {
            // If the document has been previously captured from a shared reference, then we are done
            return null;
        }
        // GET AND WRITE CONTENT TO LOCAL STORAGE //
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
            await DialogProxyTools.writeContentChunk(this.delegateUserId(), tenantId, offlineContentId, nextSequence, largePropertyVisitor);
            if (!largePropertyVisitor.visitHasMore()) {
                break;
            }
            nextSequence++;
        }
        return null;
    }

    private async captureNextOfflineLastComment(baseUrl: string, tenantId: string, sessionId: string, beforeDocumentsListDialog: DialogVisitor, afterDocumentsListDialog: DialogVisitor, nextDocumentRecordVisitor: RecordVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineLastComment';
        const nextRecordId = nextDocumentRecordVisitor.visitRecordId();
        Log.info(`${thisMethod} -- capturing last comment: ${nextRecordId}`);
        this.notifyClientListener({
            message: `Capturing last comment: ${nextRecordId}`,
            eventType: ClientEventType.MESSAGE
        });
        const beforeAndAfterValues = await DialogProxyTools.captureMenuActionRedirectionAndDialog(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeDocumentsListDialog.visitId(), afterDocumentsListDialog.visitId(), SdaDialogDelegate.ALIAS_SHOW_LATEST_MENU_ACTION_ID, nextRecordId);
        const beforeDialogVisitor = new DialogVisitor(beforeAndAfterValues.beforeDialog);
        const beforePropertiesDialogVisitor = beforeDialogVisitor.visitChildAtName(SdaDialogDelegateTools.MOBILE_COMMENT_DETAILS_PROPERTIES_DIALOG_NAME);
        if (beforeDialogVisitor.visitDialogName() !== SdaDialogDelegateTools.MOBILE_COMMENT_DETAILS_ROOT_DIALOG_NAME) {
            return;
        }
        const afterDialogVisitor = new DialogVisitor(beforeAndAfterValues.afterDialog);
        const afterPropertiesDialogVisitor = afterDialogVisitor.visitChildAtName(SdaDialogDelegateTools.MOBILE_COMMENT_DETAILS_PROPERTIES_DIALOG_NAME);
        Log.info(`${thisMethod} -- latest document before dialog id: ${beforePropertiesDialogVisitor.visitId()}`);
        Log.info(`${thisMethod} -- latest document after dialog id: ${afterPropertiesDialogVisitor.visitId()}`);
        await DialogProxyTools.captureRecord(this.delegateUserId(), baseUrl, tenantId, sessionId, beforeAndAfterValues, SdaDialogDelegateTools.MOBILE_COMMENT_DETAILS_PROPERTIES_DIALOG_NAME);
        const nextRecordIdEncoded = Base64.encodeUrlSafeString(nextRecordId);
        Log.info(`${thisMethod} -- show latest next record id: ${nextRecordId} encoded as: ${nextRecordIdEncoded}`);
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${beforePropertiesDialogVisitor.visitId()}/actions/${SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID}`;
        const redirectionParameters = {
            targets: [],
            type: "hxgn.api.dialog.ActionParameters"
        };
        const redirectionJcr = await DialogProxyTools.commonFetchClient().postJson(baseUrl, redirectionPath, redirectionParameters);
        if (redirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening Latest Document: ${nextRecordId}`);
        }
        // TODO: this is a hack for "document not found" scenario -- fix later
        if (redirectionJcr.value['type'] === 'hxgn.api.dialog.DialogRedirection') {
            Log.info(`${thisMethod} -- skipping dialog redirection (latest document not found): ${JSON.stringify(redirectionJcr.value)}`);
            return null;
        }
        Log.info(`${thisMethod} -- last comment content redirection: ${JSON.stringify(redirectionJcr.value)}`);
        const contentRedirectionVisitor = new ContentRedirectionVisitor(redirectionJcr.value);
        const onlineContentId = contentRedirectionVisitor.visitId();
        const offlineContentId = `content_redirection_${nextRecordIdEncoded}`;
        contentRedirectionVisitor.visitAndSetId(offlineContentId);
        await DialogProxyTools.writeContentRedirection(this.delegateUserId(), tenantId, afterPropertiesDialogVisitor.visitId(), SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID, contentRedirectionVisitor);
        // GET AND WRITE CONTENT TO LOCAL STORAGE //
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
            await DialogProxyTools.writeContentChunk(this.delegateUserId(), tenantId, offlineContentId, nextSequence, largePropertyVisitor);
            if (!largePropertyVisitor.visitHasMore()) {
                break;
            }
            nextSequence++;
        }
        return null;
    }

    private async captureOfflineWorkPackages(baseUrl: string, tenantId: string, sessionId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackages';
        // CAPTURE OFFLINE WORK PACKAGES REDIRECTION AND ROOT DIALOG
        Log.info(`${thisMethod} -- capturing work packages list for offline`);
        const userId = this.delegateUserId();
        const beforeAndAfterValues = await DialogProxyTools.captureWorkbenchActionRedirectionAndDialog(userId, baseUrl, tenantId, sessionId, 'SDAWorkbench', 'WorkPackages');
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
            await this.captureNextOfflineWorkPackage(baseUrl, tenantId, sessionId, listDialogId, SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME, workPackageIdsIterator.next());
        }
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

    private async initializeAfterCreateSession(request: DialogRequest, sessionVisitor: SessionVisitor): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = request.deconstructPostSessionsPath();
        // await DialogProxyTools.showStoredDialogNavigation();
        await DialogProxyTools.showAllStorageKeys();
        await DialogProxyTools.showAllStorageKeysAndValues();
        const dialogDelegateStateVisitor = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        Log.info(`${thisMethod} -- dialog delegate state before initializing: ${dialogDelegateStateVisitor.copyAsJsonString()}`);
        Log.info(`${thisMethod} -- selected work packages count: ${dialogDelegateStateVisitor.visitSelectedWorkPackageIds().length}`);
        const loginVisitor = new LoginVisitor(request.body());
        dialogDelegateStateVisitor.visitAndSetBaseUrl(request.baseUrl());
        dialogDelegateStateVisitor.visitAndSetTenantId(pathFields.tenantId);
        dialogDelegateStateVisitor.visitAndSetSessionId(sessionVisitor.visitId());
        dialogDelegateStateVisitor.visitAndSetUserId(sessionVisitor.visitUserId());
        // dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitAndClearRecords();
        await SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, dialogDelegateStateVisitor);
        this._dialogDelegateStateVisitor = dialogDelegateStateVisitor;
        const freshDialogDelegateStateVisitor = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, sessionVisitor.visitUserId());
        Log.info(`${thisMethod} -- dialog delegate state after initializing: ${freshDialogDelegateStateVisitor.copyAsJsonString()}`);
        Log.info(`${thisMethod} -- done initializing`);
    }

    private notifyClientListener(clientEvent: ClientEvent) {
        const clientListener = this._dialogProxy.clientListener();
        if (clientListener) {
            clientListener(clientEvent);
        }
    }

    private performBriefcaseWorkbenchActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostWorkbenchActionPath();
        const dialogRedirection = Briefcase_Briefcase_FORM_REDIRECTION.copyOfResponse();
        DialogRedirectionVisitor.propagateDialogId(dialogRedirection, SdaDialogDelegateTools.BRIEFCASE_ROOT_DIALOG_ID);
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(dialogRedirection, pathFields.tenantId, pathFields.sessionId);
        return Promise.resolve(new JsonClientResponse(dialogRedirection, 303));
    }

    private async performCreateSessionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performCreateSessionRequest';
        const pathFields = request.deconstructPostSessionsPath();
        const loginVisitor = new LoginVisitor(request.body());
        const delegateState = await SdaDialogDelegateTools.readDialogDelegateStateVisitor(pathFields.tenantId, loginVisitor.visitUserId());
        if (!delegateState || delegateState.visitBriefcase().visitOnline()) {
            return null;
        }
        const offlineSessionId = delegateState.visitSessionId();
        const offlineLoginHash = delegateState.visitLoginHash();
        const candidateLoginHash = SdaDialogDelegateTools.createOfflineLoginHash(pathFields.tenantId, offlineSessionId, loginVisitor.visitUserId(), loginVisitor.visitPassword());
        if (candidateLoginHash !== offlineLoginHash) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("User Id or Password is not valid");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const offlineSessionVisitor = await SdaDialogDelegateTools.readOfflineSession(pathFields.tenantId, delegateState.visitUserId());
        Log.info(`${thisMethod} -- returning offline session: ${offlineSessionVisitor.copyAsJsonString()}`);
        return new JsonClientResponse(offlineSessionVisitor.enclosedJsonObject(), 200);
    }

    private performDeleteSessionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performDeleteSessionRequest';
        if (!this.delegateOnline()) {
            const pathFields = request.deconstructDeleteSessionPath();
            return Promise.resolve(new JsonClientResponse(SdaDialogDelegateTools.constructOfflineLogoutResponse(pathFields.sessionId), 200));
        }
        return null;
    }

    private async performEnterOfflineModeContinueRequest(baseUrl: string, tenantId: string, sessionId: string): Promise<JsonClientResponse> {
        if (!this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already offline");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        await this.captureOfflineWorkPackages(baseUrl, tenantId, sessionId);
        const offlineSessionJcr = await this.captureOfflineSession(baseUrl, tenantId, sessionId);
        this.delegateBriefcaseVisitor().visitAndSetOnline(false);
        await SdaDialogDelegateTools.writeDialogDelegateState(tenantId, this._dialogDelegateStateVisitor);
        const nullRedirection = SdaDialogDelegateTools.constructBriefcaseEnterOfflineDetailsNullRedirection(tenantId, sessionId, true);
        this.notifyClientListener({
            message: 'Enter offline mode completed',
            eventType: ClientEventType.OFFLINE
        });
        return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
    }

    private async performEnterOfflineModeMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const pathFields = request.deconstructPostMenuActionPath();
        const dialogRedirection = Briefcase_EnterOfflineMode_REDIRECTION.copyOfResponse();
        DialogRedirectionVisitor.propagateDialogId(dialogRedirection, SdaDialogDelegateTools.BRIEFCASE_ENTER_OFFLINE_ROOT_DIALOG_ID);
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(dialogRedirection, pathFields.tenantId, pathFields.sessionId);
        return Promise.resolve(new JsonClientResponse(dialogRedirection, 303));
    }

    /**
     *
     * NOTE: The Work_Package_Id referenced by the show_tags action is an implied Work_Package_Id, it is not
     *       an actual argument on the action. It can be implied because the parent dialog is constrained by
     *       the work package id.
     *
     * Work_Packages
     *      .alias_Open@Work_Package_Id -> Workpackage_Documents_FORM@Work_Package_Id
     *          Workpackage_Documents_Documents@Work_Package_Id
     *              .create_comment@Document_ID -> Documents_CreateComment
     *          .show_tags@Work_Package_Id -> Tags
     *              Workpackage_Tags_Tags@Work_Package_Id
     *                  .create_comment@Tag_Id -> Documents_CreateComment
     *              .open@TagId -> Tag_Details_FORM@Tag_Id
     *                  Tag_Details_Documents@Tag_Id
     *                      .createComment@Document_Id -> Documents_CreateComment
     *
     */
    private async performExitOfflineModeMenuActionRequest(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performExitOfflineModeMenuActionRequest';
        if (this.delegateOnline()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel("Already online");
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = request.deconstructPostMenuActionPath();
        // ------------------------------------------- //
        // CREATE A NEW SESSION
        // ------------------------------------------- //
        // this.notifyClientListener({message: 'Performing login for synchronize', eventType: ClientEventType.MESSAGE});
        // const sessionJcr = await this.performLoginForOnlineProcessing(pathFields.tenantId);
        // if (sessionJcr.statusCode !== 200) {
        //     return sessionJcr;
        // }
        // const onlineSessionVisitor = new SessionVisitor(sessionJcr.value);
        // const tenantId = onlineSessionVisitor.visitTenantId();
        const tenantId = pathFields.tenantId;
        const sessionId = pathFields.sessionId;
        // ------------------------------------------- //
        // GET LATEST ONLINE WORK PACKAGES
        // ------------------------------------------- //
        const workPackagesWorkbenchActionPath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbench/actions/WorkPackages`;
        Log.info(`${thisMethod} -- getting work packages redirection: ${workPackagesWorkbenchActionPath}`);
        this.notifyClientListener({message: 'Getting latest work packages', eventType: ClientEventType.MESSAGE});
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
            throw new Error(`Unexpected result when getting work package records: ${workPackagesQueryRecordsJcr.statusCode} ${JSON.stringify(workPackagesQueryRecordsJcr.value)}`);
        }
        // ------------------------------------------- //
        // ITERATE EACH OFFLINE WORK PACKAGE ID
        // ------------------------------------------- //
        for (const workPackageId of this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds()) {
            Log.info(`${thisMethod} -- synchronizing selected work package: ${workPackageId}`);
            this.notifyClientListener({
                message: `Synchronizing work package: ${workPackageId}`,
                eventType: ClientEventType.MESSAGE
            });
            const workPackageIdEncoded = Base64.encodeUrlSafeString(workPackageId);
            Log.info(`${thisMethod} -- synchronizing selected work package encoded id: ${workPackageIdEncoded}`);
            // --------------------------------------------------------- //
            // NAVIGATE INTO THIS WORK PACKAGE FOR DOCUMENTS
            // NOTE: WE ARE NOT RETRIEVING DOCUMENT RECORDS
            // --------------------------------------------------------- //
            this.notifyClientListener({
                message: `Retrieving documents for work package: ${workPackageId}`,
                eventType: ClientEventType.MESSAGE
            });
            const documentsMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${workPackagesListDialogVisitor.visitId()}/actions/${SdaDialogDelegate.ALIAS_OPEN_MENU_ACTION_ID}`;
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
            // ------------------------------------------------- //
            // FIND OFFLINE DOCUMENT ACTIVITY FOR THIS WORK
            // PACKAGE ID AND POST ITS CHANGES
            // ------------------------------------------------- //
            const createCommentForDocActionSignature = `${this.delegateUserId()}.${pathFields.tenantId}.Workpackage_Documents_Documents@${workPackageIdEncoded}.${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}`;
            const allKeys = await storage.getAllKeys();
            for (const k of allKeys) {
                if (k.startsWith(createCommentForDocActionSignature)) {
                    Log.info(`${thisMethod} -- create document comment activity exists for work package: ${workPackageId}`);
                    const dialogRedirectionJsonObject = await storage.getJson(k);
                    const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJsonObject);
                    Log.info(`${thisMethod} -- create document comment activity exists for work package: ${workPackageId} at redirection: ${dialogRedirectionVisitor.copyAsJsonString()}`);
                    const dialogId = dialogRedirectionVisitor.visitDialogId();
                    Log.info(`${thisMethod} -- create document comment activity exists for work package: ${workPackageId} at dialog id: ${dialogId}`);
                    const documentId = dialogRedirectionVisitor.visitRecordId();
                    Log.info(`${thisMethod} -- create document comment activity exists for work package: ${workPackageId} at document id: ${documentId}`);
                    const dialogIdAndSuffix = dialogId.split('$');
                    const suffix = dialogIdAndSuffix[1];
                    Log.info(`${thisMethod} -- create document comment activity exists for work package: ${workPackageId} at suffix: ${suffix}`);
                    const recordCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.recordcommit`;
                    const recordCommitJsonObject = await storage.getJson(recordCommitKey);
                    if (recordCommitJsonObject) {
                        Log.info(`${thisMethod} -- committed document comment exists for work package: ${JSON.stringify(recordCommitJsonObject)}`);
                        // ------------------------------------------------- //
                        // NAVIGATE TO THE "CREATE COMMENT" DIALOG
                        // ------------------------------------------------- //
                        const createCommentMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${documentsListDialogVisitor.visitId()}/actions/${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}`;
                        const createCommentMenuActionParameters = {
                            targets: [documentId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- opening a create document comment dialog: ${createCommentMenuActionPath}`);
                        this.notifyClientListener({
                            message: `Synchronizing document comment: ${workPackageId}`,
                            eventType: ClientEventType.MESSAGE
                        });
                        const createCommentDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), createCommentMenuActionPath, createCommentMenuActionParameters);
                        if (createCommentDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for create document comment: ${createCommentDialogRedirectionJcr.statusCode} ${JSON.stringify(createCommentDialogRedirectionJcr.value)}`);
                        }
                        const createCommentDialogRedirectionVisitor = new DialogRedirectionVisitor(createCommentDialogRedirectionJcr.value);
                        const createCommentDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting create document comment dialog: ${createCommentMenuActionPath}`);
                        const createCommentDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), createCommentDialogPath);
                        if (createCommentDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting create document comment dialog: ${createCommentDialogJcr.statusCode} ${JSON.stringify(createCommentDialogJcr.value)}`);
                        }
                        // ------------------------------------------------- //
                        // IF AN IMAGE WAS POSTED IN OFFLINE, POST IT NOW
                        // ------------------------------------------------- //
                        const propertyCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.P_IMAGE.propertycommit`;
                        const propertyCommitJsonObject = await storage.getJson(propertyCommitKey);
                        if (propertyCommitJsonObject) {
                            this.notifyClientListener({
                                message: `Writing image for document comment: ${documentId}`,
                                eventType: ClientEventType.MESSAGE
                            });
                            const commitCreateCommentPropertyPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record/P_IMAGE`;
                            for (const writeLargeProperty of propertyCommitJsonObject) {
                                Log.info(`${thisMethod} -- committing create document comment large property: ${commitCreateCommentPropertyPath}`);
                                const commitCreateCommentPropertyJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentPropertyPath, writeLargeProperty);
                                if (commitCreateCommentPropertyJcr.statusCode !== 200) {
                                    Log.error(`Unexpected result when committing create document comment large property: ${commitCreateCommentPropertyJcr.statusCode} ${JSON.stringify(commitCreateCommentPropertyJcr.value)}`);
                                    break;
                                }
                            }
                        }
                        // ------------------------------------------------- //
                        // COMMIT THE COMMENT RECORD NOW
                        // ------------------------------------------------- //
                        const commitCreateCommentRecordPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record`;
                        Log.info(`${thisMethod} -- committing create document comment: ${commitCreateCommentRecordPath}`);
                        const commitCreateCommentRecordJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentRecordPath, recordCommitJsonObject);
                        Log.info(`${thisMethod} -- commit create document comment result: ${commitCreateCommentRecordJcr.statusCode} ${JSON.stringify(commitCreateCommentRecordJcr.value)}`);
                    }
                }
            }
            // --------------------------------------------------------- //
            // NAVIGATE INTO THIS WORK PACKAGE FOR TAGS
            // NOTE: WE ARE NOT RETRIEVING TAG RECORDS
            // --------------------------------------------------------- //
            const documentsListDialogId = documentsListDialogVisitor.visitId();
            const tagsMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${documentsListDialogId}/actions/${SdaDialogDelegate.ALIAS_SHOW_TAGS_MENU_ACTION_ID}`;
            // NOTE: Although we are navigating tags for a particular work package id, this action contains no targets
            const tagsMenuActionParameters = {
                targets: [],
                type: "hxgn.api.dialog.ActionParameters"
            };
            Log.info(`${thisMethod} -- getting tags redirection: ${tagsMenuActionPath}`);
            this.notifyClientListener({
                message: `Getting tags for work package: ${workPackageId}`,
                eventType: ClientEventType.MESSAGE
            });
            const tagsDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), tagsMenuActionPath, tagsMenuActionParameters);
            if (tagsDialogRedirectionJcr.statusCode !== 303) {
                throw new Error(`Unexpected result when posting for tags: ${tagsDialogRedirectionJcr.statusCode} ${JSON.stringify(tagsDialogRedirectionJcr.value)}`);
            }
            const tagsRedirectionVisitor = new DialogRedirectionVisitor(tagsDialogRedirectionJcr.value);
            const tagsDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${tagsRedirectionVisitor.visitDialogId()}`;
            Log.info(`${thisMethod} -- getting tags dialog: ${tagsDialogPath}`);
            const tagsDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), tagsDialogPath);
            if (tagsDialogJcr.statusCode !== 200) {
                throw new Error(`Unexpected result when getting tags dialog: ${tagsDialogJcr.statusCode}`);
            }
            const tagsRootDialogVisitor = new DialogVisitor(tagsDialogJcr.value);
            const tagsListDialogVisitor = tagsRootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
            const tagsQueryRecordsPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${tagsListDialogVisitor.visitId()}/records`;
            const tagsQueryParameters = {
                fetchDirection: "FORWARD",
                fetchMaxRecords: 999,
                type: "hxgn.api.dialog.QueryParameters"
            };
            Log.info(`${thisMethod} -- getting tags record set: ${tagsQueryRecordsPath}`);
            const tagsQueryRecordsJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), tagsQueryRecordsPath, tagsQueryParameters);
            if (tagsQueryRecordsJcr.statusCode !== 200) {
                throw new Error(`Unexpected result when getting tags records: ${tagsQueryRecordsJcr.statusCode} ${JSON.stringify(tagsQueryRecordsJcr.value)}`);
            }
            // ------------------------------------------- //
            // ITERATE EACH OFFLINE WORK PACKAGE ID
            // ------------------------------------------- //
            const tagsQueryRecordSetVisitor = new RecordSetVisitor(tagsQueryRecordsJcr.value);
            for (const tagsRecord of tagsQueryRecordSetVisitor.visitRecords()) {
                const tagId = tagsRecord.visitRecordId();
                const tagIdEncoded = Base64.encodeUrlSafeString(tagId);
                // ------------------------------------------------- //
                // FIND OFFLINE DOCUMENT ACTIVITY FOR THIS WORK
                // PACKAGE ID AND POST ITS CHANGES
                // ------------------------------------------------- //
                const dialogRedirectionKey = `${this.delegateUserId()}.${pathFields.tenantId}.Workpackage_Tags_Tags@${workPackageIdEncoded}.${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}@${tagIdEncoded}.redirection`;
                const dialogRedirectionJsonObject = await storage.getJson(dialogRedirectionKey);
                if (dialogRedirectionJsonObject) {
                    Log.info(`${thisMethod} -- create tag comment activity exists for work package: ${workPackageId}`);
                    const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJsonObject);
                    Log.info(`${thisMethod} -- create tag comment activity exists for work package: ${workPackageId} at redirection: ${dialogRedirectionVisitor.copyAsJsonString()}`);
                    const dialogId = dialogRedirectionVisitor.visitDialogId();
                    Log.info(`${thisMethod} -- create tag comment activity exists for work package: ${workPackageId} at dialog id: ${dialogId}`);
                    Log.info(`${thisMethod} -- create tag comment activity exists for work package: ${workPackageId} at tag id: ${tagId}`);
                    const dialogIdAndSuffix = dialogId.split('$');
                    const suffix = dialogIdAndSuffix[1];
                    Log.info(`${thisMethod} -- create tag comment activity exists for work package: ${workPackageId} at suffix: ${suffix}`);
                    const recordCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.recordcommit`;
                    const recordCommitJsonObject = await storage.getJson(recordCommitKey);
                    if (recordCommitJsonObject) {
                        Log.info(`${thisMethod} -- committed tag comment exists for work package: ${JSON.stringify(recordCommitJsonObject)}`);
                        // ------------------------------------------------- //
                        // NAVIGATE TO THE "CREATE COMMENT" DIALOG
                        // ------------------------------------------------- //
                        const createCommentMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${tagsListDialogVisitor.visitId()}/actions/${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}`;
                        const createCommentMenuActionParameters = {
                            targets: [tagId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- opening a create tag comment dialog: ${createCommentMenuActionPath}`);
                        this.notifyClientListener({
                            message: `Synchronizing tag comment: ${tagId}`,
                            eventType: ClientEventType.MESSAGE
                        });
                        const createCommentDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), createCommentMenuActionPath, createCommentMenuActionParameters);
                        if (createCommentDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for create tag comment: ${createCommentDialogRedirectionJcr.statusCode} ${JSON.stringify(createCommentDialogRedirectionJcr.value)}`);
                        }
                        const createCommentDialogRedirectionVisitor = new DialogRedirectionVisitor(createCommentDialogRedirectionJcr.value);
                        const createCommentDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting create tag comment dialog: ${createCommentMenuActionPath}`);
                        const createCommentDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), createCommentDialogPath);
                        if (createCommentDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting create tag comment dialog: ${createCommentDialogJcr.statusCode} ${JSON.stringify(createCommentDialogJcr.value)}`);
                        }
                        // ------------------------------------------------- //
                        // IF AN IMAGE WAS POSTED IN OFFLINE, POST IT NOW
                        // ------------------------------------------------- //
                        const propertyCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${suffix}.P_IMAGE.propertycommit`;
                        const propertyCommitJsonObject = await storage.getJson(propertyCommitKey);
                        if (propertyCommitJsonObject) {
                            this.notifyClientListener({
                                message: `Writing image for tag comment: ${tagId}`,
                                eventType: ClientEventType.MESSAGE
                            });
                            const commitCreateCommentPropertyPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record/P_IMAGE`;
                            for (const writeLargeProperty of propertyCommitJsonObject) {
                                Log.info(`${thisMethod} -- committing create tag comment large property: ${commitCreateCommentPropertyPath}`);
                                const commitCreateCommentPropertyJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentPropertyPath, writeLargeProperty);
                                if (commitCreateCommentPropertyJcr.statusCode !== 200) {
                                    Log.error(`Unexpected result when committing create tag comment large property: ${commitCreateCommentPropertyJcr.statusCode} ${JSON.stringify(commitCreateCommentPropertyJcr.value)}`);
                                    break;
                                }
                            }
                        }
                        // ------------------------------------------------- //
                        // COMMIT THE COMMENT RECORD NOW
                        // ------------------------------------------------- //
                        const commitCreateCommentRecordPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record`;
                        Log.info(`${thisMethod} -- committing create tag comment: ${commitCreateCommentRecordPath}`);
                        const commitCreateCommentRecordJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentRecordPath, recordCommitJsonObject);
                        Log.info(`${thisMethod} -- commit create tag comment result: ${commitCreateCommentRecordJcr.statusCode} ${JSON.stringify(commitCreateCommentRecordJcr.value)}`);
                    }
                }
                const createCommentForTagDocRedirectionPrefix = `${this.delegateUserId()}.${pathFields.tenantId}.Tag_Details_Documents@${tagIdEncoded}.${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}`;
                const allKeys2 = await storage.getAllKeys();
                for (const k of allKeys2) {
                    if (k.startsWith(createCommentForTagDocRedirectionPrefix)) {
                        const createCommentForTagDocRedirectionJsonObject = await storage.getJson(k);
                        if (!createCommentForTagDocRedirectionJsonObject) {
                            Log.error(`Tag comment JSON object not found at key: ${k}`);
                            continue;
                        }
                        const createCommentForTagDocRedirectionVisitor = new DialogRedirectionVisitor(createCommentForTagDocRedirectionJsonObject);
                        Log.info(`${thisMethod} -- create tag document comment activity exists for tag id: ${JSON.stringify(tagId)}`);
                        Log.info(`${thisMethod} -- create tag document comment activity exists for tag id encoded: ${JSON.stringify(tagIdEncoded)}`);
                        const createCommentForTagDocDialogId = createCommentForTagDocRedirectionVisitor.visitDialogId();
                        Log.info(`${thisMethod} -- create tag document comment dialogId: ${JSON.stringify(createCommentForTagDocDialogId)}`);
                        const createCommentForTagDocDialogIdAndSuffix = createCommentForTagDocDialogId.split('$');
                        const createCommentForTagDocSuffix = createCommentForTagDocDialogIdAndSuffix[1];
                        Log.info(`${thisMethod} -- create tag document comment activity exists for tag id encoded: ${tagIdEncoded} at suffix: ${createCommentForTagDocSuffix}`);
                        const recordCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${createCommentForTagDocSuffix}.recordcommit`;
                        const recordCommitJsonObject = await storage.getJson(recordCommitKey);
                        if (!recordCommitJsonObject) {
                            continue;
                        }
                        const openTagDetailsMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${tagsListDialogVisitor.visitId()}/actions/${SdaDialogDelegate.OPEN_MENU_ACTION_ID}`;
                        const openTagDetailsMenuActionParameters = {
                            targets: [tagId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- opening tag details dialog: ${openTagDetailsMenuActionPath}`);
                        const openTagDetailsDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), openTagDetailsMenuActionPath, openTagDetailsMenuActionParameters);
                        if (openTagDetailsDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for open tag details: ${openTagDetailsDialogRedirectionJcr.statusCode} ${JSON.stringify(openTagDetailsDialogRedirectionJcr.value)}`);
                        }
                        const openTagDetailsDialogRedirectionVisitor = new DialogRedirectionVisitor(openTagDetailsDialogRedirectionJcr.value);
                        const openTagDetailsDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${openTagDetailsDialogRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting open tag details dialog: ${openTagDetailsMenuActionPath}`);
                        const openTagDetailsDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), openTagDetailsDialogPath);
                        if (openTagDetailsDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting open tag details dialog: ${openTagDetailsDialogJcr.statusCode} ${JSON.stringify(openTagDetailsDialogJcr.value)}`);
                        }
                        const openTagDetailsListDialog = (new DialogVisitor(openTagDetailsDialogJcr.value)).visitChildAtName(SdaDialogDelegateTools.TAG_DETAILS_LIST_DIALOG_NAME);
                        // ------------------------------------------------- //
                        // NAVIGATE TO THE "CREATE COMMENT" DIALOG
                        // ------------------------------------------------- //
                        const createCommentMenuActionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${openTagDetailsListDialog.visitId()}/actions/${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}`;
                        const tagDocumentId = createCommentForTagDocRedirectionVisitor.visitRecordId();
                        const createCommentMenuActionParameters = {
                            targets: [tagDocumentId],
                            type: "hxgn.api.dialog.ActionParameters"
                        };
                        Log.info(`${thisMethod} -- opening a create tag doc comment dialog: ${createCommentMenuActionPath}`);
                        this.notifyClientListener({
                            message: `Synchronizing tag document comment: ${tagDocumentId}`,
                            eventType: ClientEventType.MESSAGE
                        });
                        const createCommentDialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(this.delegateBaseUrl(), createCommentMenuActionPath, createCommentMenuActionParameters);
                        if (createCommentDialogRedirectionJcr.statusCode !== 303) {
                            throw new Error(`Unexpected result when posting for create tag doc comment: ${createCommentDialogRedirectionJcr.statusCode} ${JSON.stringify(createCommentDialogRedirectionJcr.value)}`);
                        }
                        const createCommentDialogRedirectionVisitor = new DialogRedirectionVisitor(createCommentDialogRedirectionJcr.value);
                        const createCommentDialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}`;
                        Log.info(`${thisMethod} -- getting create tag doc comment dialog: ${createCommentMenuActionPath}`);
                        const createCommentDialogJcr = await DialogProxyTools.commonFetchClient().getJson(this.delegateBaseUrl(), createCommentDialogPath);
                        if (createCommentDialogJcr.statusCode !== 200) {
                            throw new Error(`Unexpected result when getting create tag comment dialog: ${createCommentDialogJcr.statusCode} ${JSON.stringify(createCommentDialogJcr.value)}`);
                        }
                        // ------------------------------------------------- //
                        // IF AN IMAGE WAS POSTED IN OFFLINE, POST IT NOW
                        // ------------------------------------------------- //
                        const propertyCommitKey = `${this.delegateUserId()}.${tenantId}.Documents_CreateComment$${createCommentForTagDocSuffix}.P_IMAGE.propertycommit`;
                        const propertyCommitJsonObject = await storage.getJson(propertyCommitKey);
                        if (propertyCommitJsonObject) {
                            this.notifyClientListener({
                                message: `Writing image for tag comment: ${tagDocumentId}`,
                                eventType: ClientEventType.MESSAGE
                            });
                            const commitCreateCommentPropertyPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record/P_IMAGE`;
                            for (const writeLargeProperty of propertyCommitJsonObject) {
                                Log.info(`${thisMethod} -- committing create tag doc comment large property: ${commitCreateCommentPropertyPath}`);
                                const commitCreateCommentPropertyJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentPropertyPath, writeLargeProperty);
                                if (commitCreateCommentPropertyJcr.statusCode !== 200) {
                                    Log.error(`Unexpected result when committing create tag comment large property: ${commitCreateCommentPropertyJcr.statusCode} ${JSON.stringify(commitCreateCommentPropertyJcr.value)}`);
                                    break;
                                }
                            }
                        }
                        // ------------------------------------------------- //
                        // COMMIT THE COMMENT RECORD NOW
                        // ------------------------------------------------- //
                        const commitCreateCommentRecordPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${createCommentDialogRedirectionVisitor.visitDialogId()}/record`;
                        Log.info(`${thisMethod} -- committing create tag doc comment: ${commitCreateCommentRecordPath}`);
                        const commitCreateCommentRecordJcr = await DialogProxyTools.commonFetchClient().putJson(this.delegateBaseUrl(), commitCreateCommentRecordPath, recordCommitJsonObject);
                        Log.info(`${thisMethod} -- commit create tag doc comment result: ${commitCreateCommentRecordJcr.statusCode} ${JSON.stringify(commitCreateCommentRecordJcr.value)}`);
                    }
                }
            } // for each online tag record
        } // for each offline work package id
        // -------------------------------------------------- //
        // TODO: CLEAR TRANSACTION DATA FROM LOCAL STORAGE
        // -------------------------------------------------- //
        this._dialogDelegateStateVisitor.visitAndClearSelectedWorkPackageIds();
        this._dialogDelegateStateVisitor.visitMobileCommentsRecordSet().visitAndClearRecords();
        this.delegateWorkPackagesRecordSetVisitor().visitAndClearRecords();
        this.notifyClientListener({message: 'Exit offline mode completed', eventType: ClientEventType.ONLINE});
        this.delegateBriefcaseVisitor().visitAndSetOnline(true);
        await SdaDialogDelegateTools.writeDialogDelegateState(pathFields.tenantId, this._dialogDelegateStateVisitor);
        const nullRedirection = SdaDialogDelegateTools.constructExitOfflineModeNullRedirection(pathFields.tenantId, pathFields.sessionId);
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
        createCommentDialogVisitor.visitAndSetReferringDialogId(request.dialogId());
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

    private async performOfflineShowLatestMenuAction(request: DialogRequest): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineShowLatestMenuAction';
        Log.info(`${thisMethod} -- SHOW LATEST REQUEST ${request.resourcePath()}`);
        Log.info(`${thisMethod} -- SHOW LATEST BODY ${JSON.stringify(request.body())}`);
        // CHECK IF A "CREATE COMMENT" EXISTS THAT WILL OVERRIDE THE LATEST
        const actionParameters = new ActionParametersVisitor(request.body());
        const recordId = actionParameters.visitTargetsValue()[0];
        const recordIdEncoded = Base64.encodeUrlSafeString(recordId);
        const actionIdAtRecordId = `${SdaDialogDelegate.ALIAS_CREATE_COMMENT_MENU_ACTION_ID}@${recordIdEncoded}`;
        const createCommentRedirectionKey = DialogProxyTools.constructRedirectionStorageKey(this.delegateUserId(), request.tenantId(), request.dialogId(), actionIdAtRecordId);
        Log.info(`${thisMethod} -- CHECKING FOR CREATE COMMENT AT ${createCommentRedirectionKey}`);
        const dialogRedirectionJsonObject = await storage.getJson(createCommentRedirectionKey);
        Log.info(`${thisMethod} -- RESULT OF CHECK ${JSON.stringify(dialogRedirectionJsonObject)}`);
        if (dialogRedirectionJsonObject) {
            // TODO: synthesized redirections and dialogs need to be deleted when the UI invokes 'deleteJson' on the dialog path.
            // Capture a new timestamp used to derive dialog ids
            const timeInMillis = Date.now().toString();
            // --- RETRIEVE LAST CREATE COMMENT ---
            const createCommentRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJsonObject);
            Log.info(`${thisMethod} -- last create comment dialog id: ${createCommentRedirectionVisitor.visitDialogId()}`);
            const createCommentChildDialogName = 'Documents_CreateComment';
            const createCommentSuffix = createCommentRedirectionVisitor.visitDialogId().split('$')[1];
            const createCommentChildDialogId = createCommentChildDialogName + '$' + createCommentSuffix;
            const createCommentRecordVistor = await DialogProxyTools.readRecordCommitAsVisitor(this.delegateUserId(), request.tenantId(), createCommentChildDialogId);
            Log.info(`${thisMethod} -- last create record: ${createCommentRecordVistor.copyAsJsonString()}`);
            const commentNameValue = createCommentRecordVistor.visitPropertyValueAt('P_NAME');
            const commentDescValue = createCommentRecordVistor.visitPropertyValueAt('P_DESCRIPTION');
            // --- RETRIEVE LAST CREATE COMMENT LATEST FILE ---
            const createCommentPropertyCommit = await DialogProxyTools.readPropertyCommit(this.delegateUserId(), request.tenantId(), createCommentChildDialogId, 'P_IMAGE');
            // --- REDIRECTION ---
            const showLatestRedirectionVisitor = new DialogRedirectionVisitor(MobileComment_Details_FORM_REDIRECTION.copyOfResponse());
            showLatestRedirectionVisitor.propagateTenantIdAndSessionId(request.tenantId(), request.sessionId());
            showLatestRedirectionVisitor.visitAndSetReferringDialogId(request.dialogId());
            showLatestRedirectionVisitor.visitAndSetRecordId(recordId);
            // showLatestRedirectionVisitor.deriveDialogIdsFromDialogNameAndRecordId();
            showLatestRedirectionVisitor.deriveDialogIdsFromDialogNameAndSuffix(timeInMillis);
            const mobileCommentDetailsFormSyntheticDialogId = showLatestRedirectionVisitor.visitDialogId();
            Log.info(`${thisMethod} -- synthesizing dialog redirection ${showLatestRedirectionVisitor.copyAsJsonString()}`);
            await DialogProxyTools.writeDialogRedirection(this.delegateUserId(), request.tenantId(), showLatestRedirectionVisitor.visitDialogId(), SdaDialogDelegate.ALIAS_SHOW_LATEST_MENU_ACTION_ID, showLatestRedirectionVisitor);
            // --- DIALOG ---
            const showLatestDialogVisitor = new DialogVisitor(MobileComment_Details_FORM.copyOfResponse());
            showLatestDialogVisitor.visitAndSetDescription(`Mobile Comment: ${commentNameValue}`);
            showLatestDialogVisitor.visitChildAtName('MobileComment_Details_Properties').visitAndSetDescription(`Mobile Comment: ${commentNameValue}`);
            showLatestDialogVisitor.propagateTenantIdAndSessionId(request.tenantId(), request.sessionId());
            showLatestDialogVisitor.deriveDialogIdsFromDialogNameAndSuffix(timeInMillis);
            Log.info(`${thisMethod} -- synthesizing dialog ${showLatestDialogVisitor.copyAsJsonString()}`);
            await DialogProxyTools.writeDialog(this.delegateUserId(), request.tenantId(), showLatestDialogVisitor);
            // --- RECORD ---
            const showLatestRecordVisitor = new RecordVisitor(MobileComment_Details_RECORD.copyOfResponse());
            showLatestRecordVisitor.visitAndSetPropertyValueAt('Name', commentNameValue);
            showLatestRecordVisitor.visitAndSetPropertyValueAt('Description', commentDescValue);
            Log.info(`${thisMethod} -- synthesizing record ${showLatestRecordVisitor.copyAsJsonString()}`);
            const mobileCommentDetailsSyntheticDialogId = 'MobileComment_Details_Properties$' + timeInMillis;
            await DialogProxyTools.writeRecord(this.delegateUserId(), request.tenantId(), mobileCommentDetailsSyntheticDialogId, showLatestRecordVisitor);
            // --- LATEST FILE ---
            if (createCommentPropertyCommit) {
                // tenants/${tenantId}/sessions/${sessionId}/dialogs/MobileComment_Details_Properties$1533726759363/actions/alias_OpenLatestFile
                const contentRedirectionId = `content_redirection_${timeInMillis}`;
                const latestFileRedirectionJson = {
                    "tenantId": "hexagonsdaop",
                    "referringObject": {
                        "dialogType": "hxgn.api.dialog.EditorDialog",
                        "dialogMode": "READ",
                        "dialogAlias": "MobileComment_Details_Properties",
                        "dialogProperties": {"globalRefresh": "true", "localRefresh": "true"},
                        "actionId": "alias_OpenLatestFile",
                        "rootDialogName": "MobileComment_Details_FORM",
                        "type": "hxgn.api.dialog.ReferringDialog",
                        "dialogId": mobileCommentDetailsSyntheticDialogId,
                        "dialogName": "MobileComment_Details_Properties",
                        "rootDialogId": mobileCommentDetailsFormSyntheticDialogId
                    },
                    "sessionId": request.sessionId(),
                    "id": contentRedirectionId,
                    "type": "hxgn.api.dialog.ContentRedirection",
                    "contentType": "image/png"
                };
                const latestFileRedirectionVisitor = new ContentRedirectionVisitor(latestFileRedirectionJson);
                Log.info(`${thisMethod} -- synthesizing record ${showLatestRecordVisitor.copyAsJsonString()}`);
                await DialogProxyTools.writeContentRedirection(this.delegateUserId(), request.tenantId(), mobileCommentDetailsSyntheticDialogId, SdaDialogDelegate.ALIAS_OPEN_LATEST_FILE_MENU_ACTION_ID , latestFileRedirectionVisitor);
                if (createCommentPropertyCommit) {
                    for (let i=0; i < createCommentPropertyCommit.length; i++) {
                        const propertyCommit = createCommentPropertyCommit[i];
                        Log.info(`${thisMethod} -- PROPERTY COMMIT ${JSON.stringify(propertyCommit)}`);
                        const largePropertyJson = {
                            byteCount: btoa(propertyCommit['encodedData']).length,
                            encodedData: propertyCommit['encodedData'],
                            contentType: 'image/png',
                            hasMore: i < (createCommentPropertyCommit.length - 1),
                            type: 'hxgn.api.dialog.LargeProperty'
                        };
                        const largePropertyVisitor = new LargePropertyVisitor(largePropertyJson);
                        Log.info(`${thisMethod} -- WRITING CONTENT CHUNK ${JSON.stringify(largePropertyJson)}`);
                        await DialogProxyTools.writeContentChunk(this.delegateUserId(), request.tenantId(), contentRedirectionId, i, largePropertyVisitor);
                    }
                }
            }
            // --- RETURN REDIRECTION ---
            return new JsonClientResponse(showLatestRedirectionVisitor.enclosedJsonObject(), 303);
        }
        // IF A "CREATE COMMENT" DOES NOT EXIST
        return DialogProxyTools.readMenuActionRedirectionAsOfflineResponse(this.delegateUserId(), request);
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
