import { BlobClientResponse } from '../client/BlobClientResponse';
import { JsonClientResponse } from '../client/JsonClientResponse';
import { TextClientResponse } from '../client/TextClientResponse';
import { VoidClientResponse } from '../client/VoidClientResponse';
import { StreamProducer } from '../io/StreamProducer';
import { ActionParametersVisitor } from '../proxy/ActionParametersVisitor';
import { ContentRedirectionVisitor } from '../proxy/ContentRedirectionVisitor';
import { DialogDelegate } from '../proxy/DialogDelegate';
import { DialogProxyTools } from '../proxy/DialogProxyTools';
import { DialogRedirectionVisitor } from '../proxy/DialogRedirectionVisitor';
import { DialogVisitor } from '../proxy/DialogVisitor';
import { LargePropertyVisitor } from '../proxy/LargePropertyVisitor';
import { LoginVisitor } from '../proxy/LoginVisitor';
import { ReadLargePropertyParametersVisitor } from '../proxy/ReadLargePropertyParametersVisitor';
import { RecordSetVisitor } from '../proxy/RecordSetVisitor';
import { RecordVisitor } from '../proxy/RecordVisitor';
import { SessionVisitor } from '../proxy/SessionVisitor';
import { ValueIterator } from '../proxy/ValueIterator';
import { Log } from '../util/Log';
import { StringDictionary } from '../util/StringDictionary';
import { SdaGetBriefcaseDialogJsonSample } from './samples/SdaGetBriefcaseDialogJsonSample';
import { SdaPostBriefcaseWorkbenchActionJsonSample } from './samples/SdaPostBriefcaseWorkbenchActionJsonSample';
import { SdaPostWorkPackagesRecords1JsonSample } from './samples/SdaPostWorkPackagesRecords1JsonSample';
import { SdaDialogDelegateStateVisitor } from './SdaDialogDelegateStateVisitor';
import { SdaDialogDelegateTools } from './SdaDialogDelegateTools';
import { SelectedWorkPackageVisitor } from './SelectedWorkPackageVisitor';
import { WorkPackagesRecordSetVisitor } from './WorkPackagesRecordSetVisitor';

export class SdaDialogDelegate implements DialogDelegate {
    private _dialogDelegateStateVisitor: SdaDialogDelegateStateVisitor = null;
    private _lastActivity: Date = new Date();

    get lastActivity(): Date {
        return this._lastActivity;
    }

    public initialize(): Promise<void> {
        Log.info('SdaDialogDelegate::initialize -- nothing to initialize');
        return Promise.resolve();
    }

    // --- Request Handlers --- //

    public getBlob(baseUrl: string, resourcePath?: string): Promise<BlobClientResponse> | null {
        Log.info('SdaDialogDelegate::getBlob -- path: ' + resourcePath);
        if (!this.online()) {
            throw new Error(`Blob request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public getText(baseUrl: string, resourcePath?: string): Promise<TextClientResponse> | null {
        Log.info('SdaDialogDelegate::getText -- path: ' + resourcePath);
        if (!this.online()) {
            throw new Error(`Text request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public openStream(baseUrl: string, resourcePath?: string): Promise<StreamProducer> | null {
        Log.info('SdaDialogDelegate::openStream -- path: ' + resourcePath);
        if (!this.online()) {
            throw new Error(`Stream request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public postMultipart<T>(
        baseUrl: string,
        resourcePath: string,
        formData: FormData
    ): Promise<VoidClientResponse> | null {
        Log.info('SdaDialogDelegate::postMultipart -- path: ' + resourcePath);
        if (!this.online()) {
            throw new Error(`Multipart request is not valid during offline mode: ${resourcePath}`);
        }
        return null;
    }

    public getJson(
        baseUrl: string,
        resourcePath: string,
        queryParams?: StringDictionary
    ): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::getJson';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (DialogProxyTools.isGetDialog(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
            if (SdaDialogDelegateTools.isOfflineBriefcaseDialogId(pathFields.dialogId)) {
                const response = SdaGetBriefcaseDialogJsonSample.copyOfResponse();
                const briefcaseVisitor = new DialogVisitor(response);
                briefcaseVisitor.propagateTenantIdAndSessionId(pathFields.tenantId, pathFields.sessionId);
                briefcaseVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_ROOT_ID);
                briefcaseVisitor.visitChildAtNameAndSetId(
                    SdaDialogDelegateTools.BRIEFCASE_DETAILS_DIALOG_NAME,
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_DETAILS_ID
                );
                briefcaseVisitor.visitChildAtNameAndSetId(
                    SdaDialogDelegateTools.BRIEFCASE_WORK_PACKAGES_DIALOG_NAME,
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_WORK_PACKAGES_ID
                );
                briefcaseVisitor.visitChildAtNameAndSetId(
                    SdaDialogDelegateTools.BRIEFCASE_MOBILE_COMMENTS_DIALOG_NAME,
                    SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_COMMENTS_ID
                );
                return Promise.resolve(new JsonClientResponse(response, 200));
            }
        } else if (DialogProxyTools.isGetRecord(resourcePathElems)) {
            const pathFields = DialogProxyTools.deconstructGetRecordPath(resourcePathElems);
            if (SdaDialogDelegateTools.isOfflineBriefcaseDetailsDialogId(pathFields.dialogId)) {
                const response = this._dialogDelegateStateVisitor.visitBriefcase().enclosedJsonObject();
                return Promise.resolve(new JsonClientResponse(response, 200));
            } else if (SdaDialogDelegateTools.isOfflineDocumentsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineDocumentsPropertiesRecordRequest(baseUrl, resourcePathElems);
            } else if (SdaDialogDelegateTools.isOfflineTagsPropertiesDialogId(pathFields.dialogId)) {
                return this.performOfflineTagsPropertiesRecordRequest(baseUrl, resourcePathElems);
            }
        }
        if (!this.online()) {
            if (SdaDialogDelegateTools.isOfflineWorkPackagesRootDialogRequest(resourcePathElems)) {
                return this.performOfflineWorkPackagesRootDialogRequest(baseUrl, resourcePathElems);
            } else if (SdaDialogDelegateTools.isOfflineDocumentsRootDialogRequest(resourcePathElems)) {
                return this.performOfflineDocumentsRootDialogRequest(baseUrl, resourcePathElems);
            } else if (SdaDialogDelegateTools.isOfflineTagsRootDialogRequest(resourcePathElems)) {
                return this.performOfflineTagsRootDialogRequest(baseUrl, resourcePathElems);
            }
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode('getJson', resourcePath);
        }
        return null;
    }

    public postJson(
        baseUrl: string,
        resourcePath: string,
        body?: StringDictionary
    ): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::postJson';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        Log.info(`${thisMethod} -- body: ${JSON.stringify(body)}`);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (SdaDialogDelegateTools.isWorkPackagesAddToBriefcaseMenuActionRequest(resourcePathElems)) {
            return this.performWorkPackagesAddWorkPackageToBriefcase(baseUrl, resourcePathElems, body);
        } else if (SdaDialogDelegateTools.isWorkPackagesRemoveFromBriefcaseMenuActionRequest(resourcePathElems)) {
            return this.performWorkPackagesRemoveWorkPackageFromBriefcase(baseUrl, resourcePathElems, body);
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
            if (SdaDialogDelegateTools.isWorkPackagesWorkbenchActionRequest(resourcePathElems)) {
                return this.performOfflineWorkPackagesWorkbenchActionRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineWorkPackagesListRecordSetRequest(resourcePathElems)) {
                return this.performOfflineWorkPackagesListRecordSetRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineWorkPackagesOpenMenuActionRequest(resourcePathElems)) {
                return this.performOfflineWorkPackagesOpenMenuActionRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineDocumentsListRecordSetRequest(resourcePathElems)) {
                return this.performOfflineDocumentsListRecordSetRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineDocumentOpenLatestFileMenuActionRequest(resourcePathElems)) {
                return this.performOfflineDocumentOpenLatestFileMenuActionRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineDocumentContentRequest(resourcePathElems)) {
                return this.performOfflineDocumentContentRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineShowTagsMenuActionRequest(resourcePathElems)) {
                return this.performOfflineShowTagsMenuActionRequest(baseUrl, resourcePathElems, body);
            } else if (SdaDialogDelegateTools.isOfflineTagsListRecordSetRequest(resourcePathElems)) {
                return this.performOfflineTagsListRecordSetRequest(baseUrl, resourcePathElems, body);
            }
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode('postJson', resourcePath);
        }
        return null;
    }

    public putJson(baseUrl: string, resourcePath: string, body?: StringDictionary): Promise<JsonClientResponse> | null {
        Log.info('SdaDialogDelegate::putJson -- path: ' + resourcePath);
        Log.info('SdaDialogDelegate::putJson -- body: ' + JSON.stringify(body));
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode('putJson', resourcePath);
        }
        return null;
    }

    public deleteJson(baseUrl: string, resourcePath: string): Promise<JsonClientResponse> | null {
        Log.info('SdaDialogDelegate::deleteJson -- path: ' + resourcePath);
        const resourcePathElems: string[] = resourcePath.split('/');
        if (DialogProxyTools.isDeleteSessionRequest(resourcePathElems)) {
            return this.performDeleteSessionRequest(baseUrl, resourcePathElems);
        }
        if (!this.online()) {
            return DialogProxyTools.constructRequestNotValidDuringOfflineMode('deleteJson', resourcePath);
        }
        return null;
    }

    // --- Response Handlers --- //

    public handleDeleteJsonResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null {
        Log.info('SdaDialogDelegate::handleDeleteJsonResponse -- path: ' + resourcePath);
        response.then(jcr =>
            Log.info('SdaDialogDelegate::handleDeleteJsonResponse -- json response: ' + JSON.stringify(jcr.value))
        );
        return response;
    }

    public handleGetBlobResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<BlobClientResponse>
    ): Promise<BlobClientResponse> | null {
        Log.info('SdaDialogDelegate::handleGetBlobResponse -- path: ' + resourcePath);
        response.then(bcr =>
            Log.info('SdaDialogDelegate::handleGetBlobResponse -- blob response: ' + JSON.stringify(bcr.value))
        );
        return response;
    }

    public handleGetJsonResponse(
        baseUrl: string,
        resourcePath: string,
        queryParams: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null {
        Log.info('SdaDialogDelegate::handleGetJsonResponse -- path: ' + resourcePath);
        response.then(jcr =>
            Log.info('SdaDialogDelegate::handleGetJsonResponse -- json response: ' + JSON.stringify(jcr.value))
        );
        return response.then(jcr => {
            if (jcr.statusCode === 200) {
                const jsonObject = jcr.value as StringDictionary;
                if (SdaDialogDelegateTools.isWorkPackagesRootDialog(jsonObject)) {
                    const resourcePathElems: string[] = resourcePath.split('/');
                    const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
                    const workPackagesDialog = SdaDialogDelegateTools.insertBriefcaseMetaDataIntoWorkPackagesDialog(
                        jsonObject
                    );
                    return new JsonClientResponse(workPackagesDialog, 200);
                }
            }
            return jcr;
        });
    }

    public handleGetTextResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<TextClientResponse>
    ): Promise<TextClientResponse> | null {
        Log.info('SdaDialogDelegate::handleGetTextResponse -- path: ' + resourcePath);
        response.then(tcr =>
            Log.info('SdaDialogDelegate::handleGetTextResponse -- text response: ' + JSON.stringify(tcr.value))
        );
        return response;
    }

    public handleOpenStreamResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<StreamProducer>
    ): Promise<StreamProducer> | null {
        Log.info('SdaDialogDelegate::handleOpenStreamResponse -- path: ' + resourcePath);
        response.then(sp => Log.info('SdaDialogDelegate::handleOpenStreamResponse -- stream producer response: ' + sp));
        return response;
    }

    public handlePostJsonResponse(
        baseUrl: string,
        resourcePath: string,
        body: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null {
        const thisMethod = 'SdaDialogDelegate::handlePostJsonResponse';
        Log.info(`${thisMethod} -- path: ${resourcePath}`);
        response.then(jcr => Log.info(`${thisMethod} -- json response: ${JSON.stringify(jcr.value)}`));
        return response.then(jsonClientResponse => {
            if (jsonClientResponse.statusCode === 200) {
                const resourcePathElems: string[] = resourcePath.split('/');
                const jsonObject = jsonClientResponse.value as StringDictionary;
                if (DialogProxyTools.isSessionObject(jsonObject)) {
                    return this.initializeAfterCreateSession(
                        baseUrl,
                        resourcePathElems,
                        body,
                        new SessionVisitor(jsonObject)
                    ).then(voidValue => jsonClientResponse);
                } else if (SdaDialogDelegateTools.isWorkPackagesListRecordSet(resourcePathElems, jsonObject)) {
                    if (this.online()) {
                        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
                        const workPackagesRecordSetVisitor = new WorkPackagesRecordSetVisitor(jsonObject);
                        workPackagesRecordSetVisitor.updateBriefcaseColumnUsingSelections(
                            this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds()
                        );
                        this._dialogDelegateStateVisitor
                            .visitWorkPackagesRecordSet()
                            .addOrUpdateAllRecords(workPackagesRecordSetVisitor);
                        return SdaDialogDelegateTools.writeDialogDelegateState(
                            pathFields.tenantId,
                            this._dialogDelegateStateVisitor
                        ).then(voidValue => {
                            return jsonClientResponse;
                        });
                    }
                }
            }
            return jsonClientResponse;
        });
    }

    public handlePostMultipartResponse<T>(
        baseUrl: string,
        resourcePath: string,
        formData: FormData,
        response: Promise<VoidClientResponse>
    ): Promise<VoidClientResponse> | null {
        Log.info('SdaDialogDelegate::handlePostMultipartResponse -- path: ' + resourcePath);
        response.then(vcr =>
            Log.info('SdaDialogDelegate::handlePostMultipartResponse -- void response: ' + JSON.stringify(vcr.value))
        );
        return response;
    }

    public handlePutJsonResponse(
        baseUrl: string,
        resourcePath: string,
        body: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null {
        Log.info('SdaDialogDelegate::handlePutJsonResponse -- path: ' + resourcePath);
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
            return SdaDialogDelegateTools.writeOfflineSession(
                tenantId,
                this._dialogDelegateStateVisitor.visitUserId(),
                sessionVisitor
            ).then(nullValue => sessionJcr);
        });
    }

    private async captureNextOfflineWorkPackage(
        onlineWorkPackagesListDialogId: string,
        nextWorkPackageId: string,
        tenantId: string,
        sessionId: string
    ): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineWorkPackage';
        Log.info(`${thisMethod} -- capturing work package for offline: ${nextWorkPackageId}`);
        // GET REDIRECTION //
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineWorkPackagesListDialogId}/actions/alias_Open`;
        const redirectionParameters = {
            targets: [nextWorkPackageId],
            type: 'hxgn.api.dialog.ActionParameters'
        };
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            redirectionPath,
            redirectionParameters
        );
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening WorkPackage: ${nextWorkPackageId}`);
        }
        Log.info(`${thisMethod} -- work packages redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const onlineRootDialogId = dialogRedirectionVisitor.visitDialogId();
        dialogRedirectionVisitor.propagateDialogId(
            SdaDialogDelegateTools.getOfflineDocumentsDialogRootId(nextWorkPackageId)
        );
        await SdaDialogDelegateTools.writeOfflineDocumentsRedirection(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            dialogRedirectionVisitor
        );
        Log.info(`${thisMethod} -- work package documents redirection written successfully: ${nextWorkPackageId}`);
        // GET DIALOG //
        const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineRootDialogId}`;
        const rootDialogJcr = await DialogProxyTools.commonFetchClient().getJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            dialogPath
        );
        if (rootDialogJcr.statusCode !== 200) {
            throw new Error(
                `Unexpected result when getting dialog for WorkPackage documents ${nextWorkPackageId}: ${
                    rootDialogJcr.statusCode
                }`
            );
        }
        Log.info(`${thisMethod} -- work packages dialog: ${JSON.stringify(rootDialogJcr.value)}`);
        const rootDialogVisitor = new DialogVisitor(rootDialogJcr.value);
        // Capture online list dialog id before changing it to an offline id
        const propertiesDialogVisitor = rootDialogVisitor.visitChildAtName(
            SdaDialogDelegateTools.DOCUMENTS_PROPERTIES_DIALOG_NAME
        );
        const onlinePropertiesDialogId = propertiesDialogVisitor.visitId();
        const listDialogVisitor = rootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME);
        const onlineListDialogId = listDialogVisitor.visitId();
        // Change dialog ids to well-known offline ids
        rootDialogVisitor.visitAndSetId(SdaDialogDelegateTools.getOfflineDocumentsDialogRootId(nextWorkPackageId));
        rootDialogVisitor.visitChildAtNameAndSetId(
            SdaDialogDelegateTools.DOCUMENTS_PROPERTIES_DIALOG_NAME,
            SdaDialogDelegateTools.getOfflineDocumentsDialogPropertiesId(nextWorkPackageId)
        );
        const offlineListDialogId = SdaDialogDelegateTools.getOfflineDocumentsDialogListId(nextWorkPackageId);
        rootDialogVisitor.visitChildAtNameAndSetId(
            SdaDialogDelegateTools.DOCUMENTS_LIST_DIALOG_NAME,
            offlineListDialogId
        );
        await SdaDialogDelegateTools.writeOfflineDocumentsDialogRoot(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            rootDialogVisitor
        );
        // GET PROPERTIES RECORD //
        const propertiesPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlinePropertiesDialogId}/record`;
        const propertiesRecordJcr = await DialogProxyTools.commonFetchClient().getJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            propertiesPath
        );
        if (propertiesRecordJcr.statusCode !== 200) {
            throw new Error(
                `Unexpected result when getting properties record for WorkPackage ${nextWorkPackageId}: ${
                    rootDialogJcr.statusCode
                }`
            );
        }
        Log.info(`${thisMethod} -- work package properties record: ${JSON.stringify(propertiesRecordJcr.value)}`);
        const propertiesRecordVisitor = new RecordVisitor(propertiesRecordJcr.value);
        await SdaDialogDelegateTools.writeOfflineDocumentsDialogPropertiesRecord(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            propertiesRecordVisitor
        );
        // GET LIST RECORD SET //
        const listPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineListDialogId}/records`;
        const listParameters = {
            fetchDirection: 'FORWARD',
            fetchMaxRecords: 500,
            type: 'hxgn.api.dialog.QueryParameters'
        };
        const listRecordSetJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            listPath,
            listParameters
        );
        const listRecordSetVisitor = new RecordSetVisitor(listRecordSetJcr.value);
        await SdaDialogDelegateTools.writeOfflineDocumentsDialogListRecordSet(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            listRecordSetVisitor
        );
        for (const r of listRecordSetVisitor.visitRecords()) {
            await this.captureNextOfflineDocumentContent(
                onlineListDialogId,
                offlineListDialogId,
                r,
                tenantId,
                sessionId
            );
        }
        await this.captureNextOfflineTags(
            onlineListDialogId,
            offlineListDialogId,
            nextWorkPackageId,
            tenantId,
            sessionId
        );
        return null;
    }

    private async captureNextOfflineTags(
        onlineDocumentsListDialogId: string,
        offlineDocumentsListDialogId: string,
        nextWorkPackageId: string,
        tenantId: string,
        sessionId: string
    ): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineTags';
        // GET REDIRECTION //
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineDocumentsListDialogId}/actions/alias_ShowTags`;
        const redirectionParameters = {
            targets: [],
            type: 'hxgn.api.dialog.ActionParameters'
        };
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            redirectionPath,
            redirectionParameters
        );
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening Tags at dialog: ${onlineDocumentsListDialogId}`);
        }
        Log.info(`${thisMethod} -- tags redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const onlineRootDialogId = dialogRedirectionVisitor.visitDialogId();
        dialogRedirectionVisitor.propagateDialogId(
            SdaDialogDelegateTools.getOfflineTagsDialogRootId(nextWorkPackageId)
        );
        await SdaDialogDelegateTools.writeOfflineTagsRedirection(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            dialogRedirectionVisitor
        );
        Log.info(`${thisMethod} -- work package tags redirection written successfully: ${nextWorkPackageId}`);
        // GET DIALOG //
        const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineRootDialogId}`;
        const rootDialogJcr = await DialogProxyTools.commonFetchClient().getJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            dialogPath
        );
        if (rootDialogJcr.statusCode !== 200) {
            throw new Error(
                `Unexpected result when getting dialog for WorkPackage tags ${nextWorkPackageId}: ${
                    rootDialogJcr.statusCode
                }`
            );
        }
        Log.info(`${thisMethod} -- tags dialog: ${JSON.stringify(rootDialogJcr.value)}`);
        const rootDialogVisitor = new DialogVisitor(rootDialogJcr.value);
        // Capture online list dialog id before changing it to an offline id
        const propertiesDialogVisitor = rootDialogVisitor.visitChildAtName(
            SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME
        );
        const onlinePropertiesDialogId = propertiesDialogVisitor.visitId();
        const listDialogVisitor = rootDialogVisitor.visitChildAtName(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME);
        const onlineListDialogId = listDialogVisitor.visitId();
        // Change dialog ids to well-known offline ids
        rootDialogVisitor.visitAndSetId(SdaDialogDelegateTools.getOfflineTagsDialogRootId(nextWorkPackageId));
        rootDialogVisitor.visitChildAtNameAndSetId(
            SdaDialogDelegateTools.TAGS_PROPERTIES_DIALOG_NAME,
            SdaDialogDelegateTools.getOfflineTagsDialogPropertiesId(nextWorkPackageId)
        );
        const offlineListDialogId = SdaDialogDelegateTools.getOfflineTagsDialogListId(nextWorkPackageId);
        rootDialogVisitor.visitChildAtNameAndSetId(SdaDialogDelegateTools.TAGS_LIST_DIALOG_NAME, offlineListDialogId);
        await SdaDialogDelegateTools.writeOfflineTagsDialogRoot(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            rootDialogVisitor
        );
        // GET PROPERTIES RECORD //
        const propertiesPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlinePropertiesDialogId}/record`;
        const propertiesRecordJcr = await DialogProxyTools.commonFetchClient().getJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            propertiesPath
        );
        if (propertiesRecordJcr.statusCode !== 200) {
            throw new Error(
                `Unexpected result when getting properties record for WorkPackage tags ${nextWorkPackageId}: ${
                    rootDialogJcr.statusCode
                }`
            );
        }
        Log.info(`${thisMethod} -- work package tags properties record: ${JSON.stringify(propertiesRecordJcr.value)}`);
        const propertiesRecordVisitor = new RecordVisitor(propertiesRecordJcr.value);
        await SdaDialogDelegateTools.writeOfflineTagsDialogPropertiesRecord(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            propertiesRecordVisitor
        );
        // GET LIST RECORD SET //
        const listPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineListDialogId}/records`;
        const listParameters = {
            fetchDirection: 'FORWARD',
            fetchMaxRecords: 500,
            type: 'hxgn.api.dialog.QueryParameters'
        };
        const listRecordSetJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            listPath,
            listParameters
        );
        const listRecordSetVisitor = new RecordSetVisitor(listRecordSetJcr.value);
        await SdaDialogDelegateTools.writeOfflineTagsDialogListRecordSet(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            nextWorkPackageId,
            listRecordSetVisitor
        );
    }

    private async captureNextOfflineDocumentContent(
        onlineDocumentsListDialogId: string,
        offlineDocumentsListDialogId: string,
        nextDocumentRecordVisitor: RecordVisitor,
        tenantId: string,
        sessionId: string
    ): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureNextOfflineDocumentContent';
        Log.info(`${thisMethod} -- TODO: capture content online dialog id: ${onlineDocumentsListDialogId}`);
        Log.info(`${thisMethod} -- TODO: capture content offline dialog id: ${offlineDocumentsListDialogId}`);
        Log.info(`${thisMethod} -- TODO: capture content target id: ${nextDocumentRecordVisitor.visitRecordId()}`);
        // GET REDIRECTION //
        const nextDocumentId = nextDocumentRecordVisitor.visitRecordId();
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineDocumentsListDialogId}/actions/alias_OpenLatestFile`;
        const redirectionParameters = {
            targets: [nextDocumentId],
            type: 'hxgn.api.dialog.ActionParameters'
        };
        const redirectionJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            redirectionPath,
            redirectionParameters
        );
        if (redirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when opening Document: ${nextDocumentId}`);
        }
        // TODO: this is a hack for "document not found" scenario -- fix later
        if (redirectionJcr.value['type'] === 'hxgn.api.dialog.DialogRedirection') {
            Log.info(
                `${thisMethod} -- skipping dialog redirection (document not found): ${JSON.stringify(
                    redirectionJcr.value
                )}`
            );
            return null;
        }
        Log.info(`${thisMethod} -- document content redirection: ${JSON.stringify(redirectionJcr.value)}`);
        const contentRedirectionVisitor = new ContentRedirectionVisitor(redirectionJcr.value);
        const onlineContentId = contentRedirectionVisitor.visitId();
        const offlineContentId = `${offlineDocumentsListDialogId}_alias_OpenLatestFile_${nextDocumentId}`;
        const offlineRedirectionId = `${offlineContentId}.redirection`;
        contentRedirectionVisitor.visitAndSetId(offlineContentId);
        await SdaDialogDelegateTools.writeOfflineDocumentContentRedirection(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            offlineDocumentsListDialogId,
            nextDocumentId,
            contentRedirectionVisitor
        );
        Log.info(
            `${thisMethod} -- document content redirection written successfully: ${contentRedirectionVisitor.copyAsJsonString()}`
        );
        // GET CONTENT //
        let nextSequence = 0;
        while (true) {
            const contentPath = `tenants/${tenantId}/sessions/${sessionId}/content/${onlineContentId}`;
            const readLargePropertyParametersJson = {
                maxBytes: 131072,
                sequence: nextSequence,
                type: 'hxgn.api.dialog.ReadLargePropertyParameters'
            };
            const largePropertyJcr = await DialogProxyTools.commonFetchClient().postJson(
                this._dialogDelegateStateVisitor.visitBaseUrl(),
                contentPath,
                readLargePropertyParametersJson
            );
            if (largePropertyJcr.statusCode !== 200) {
                throw new Error(`Unexpected result when reading content: ${onlineContentId}`);
            }
            const largePropertyVisitor = new LargePropertyVisitor(largePropertyJcr.value);
            await SdaDialogDelegateTools.writeOfflineDocumentContentChunk(
                tenantId,
                this._dialogDelegateStateVisitor.visitUserId(),
                offlineDocumentsListDialogId,
                nextDocumentId,
                nextSequence,
                largePropertyVisitor
            );
            if (!largePropertyVisitor.visitHasMore()) {
                break;
            }
            nextSequence++;
        }
        return null;
    }

    private async performLoginForOnlineProcessing(tenantId: string): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performLoginForOnlineProcessing';
        const resourcePath = `tenants/${tenantId}/sessions`;
        const loginModel = DialogProxyTools.constructLoginModel(
            this._dialogDelegateStateVisitor.visitUserId(),
            this._dialogDelegateStateVisitor.visitPassword()
        );
        const jsonClientResponse = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            resourcePath,
            loginModel
        );
        Log.info(`${thisMethod} -- login for online completed with result ${JSON.stringify(jsonClientResponse.value)}`);
        return jsonClientResponse;
    }

    private async captureOfflineWorkPackages(tenantId: string, sessionId: string): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::captureOfflineWorkPackages';
        Log.info(`${thisMethod} -- capturing work packages list for offline`);
        // GET REDIRECTION //
        const redirectionPath = `tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbench/actions/WorkPackages`;
        const dialogRedirectionJcr = await DialogProxyTools.commonFetchClient().postJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            redirectionPath,
            {}
        );
        if (dialogRedirectionJcr.statusCode !== 303) {
            throw new Error(`Unexpected result when posting for WorkPackages: ${dialogRedirectionJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- work packages redirection: ${JSON.stringify(dialogRedirectionJcr.value)}`);
        const dialogRedirectionVisitor = new DialogRedirectionVisitor(dialogRedirectionJcr.value);
        const onlineRootDialogId = dialogRedirectionVisitor.visitDialogId();
        dialogRedirectionVisitor.propagateDialogId(SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_ID);
        await SdaDialogDelegateTools.writeOfflineWorkPackagesRedirection(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            dialogRedirectionVisitor
        );
        // GET DIALOG //
        const dialogPath = `tenants/${tenantId}/sessions/${sessionId}/dialogs/${onlineRootDialogId}`;
        const rootDialogJcr = await DialogProxyTools.commonFetchClient().getJson(
            this._dialogDelegateStateVisitor.visitBaseUrl(),
            dialogPath
        );
        if (rootDialogJcr.statusCode !== 200) {
            throw new Error(`Unexpected result when getting dialog for WorkPackages: ${rootDialogJcr.statusCode}`);
        }
        Log.info(`${thisMethod} -- work packages dialog: ${JSON.stringify(rootDialogJcr.value)}`);
        const rootDialogVisitor = new DialogVisitor(rootDialogJcr.value);
        // Capture online list dialog id before changing it to an offline id
        const listDialogVisitor = rootDialogVisitor.visitChildAtName(
            SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME
        );
        const onlineListDialogId = listDialogVisitor.visitId();
        // Change dialog ids to well-known offline ids
        rootDialogVisitor.visitAndSetId(SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_DIALOG_ROOT_ID);
        rootDialogVisitor.visitChildAtNameAndSetId(
            SdaDialogDelegateTools.WORK_PACKAGES_LIST_DIALOG_NAME,
            SdaDialogDelegateTools.OFFLINE_WORK_PACKAGES_DIALOG_LIST_ID
        );
        await SdaDialogDelegateTools.writeOfflineWorkPackagesDialogRoot(
            tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            rootDialogVisitor
        );
        // GET SELECTED WORK PACKAGES //
        Log.info(`${thisMethod} -- capturing selected work packages for offline`);
        const workPackageIdsIterator = new ValueIterator(
            this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds()
        );
        while (!workPackageIdsIterator.done()) {
            await this.captureNextOfflineWorkPackage(
                onlineListDialogId,
                workPackageIdsIterator.next(),
                tenantId,
                sessionId
            );
        }
    }

    private initializeAfterCreateSession(
        baseUrl: string,
        resourcePathElems: string[],
        body: StringDictionary,
        sessionVisitor: SessionVisitor
    ): Promise<void> {
        const thisMethod = 'SdaDialogDelegate::initializeAfterCreateSession';
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        return Promise.resolve()
            .then(voidValue => {
                Log.info(`${thisMethod} -- showing storage keys`);
                return SdaDialogDelegateTools.showAllStorageKeys();
            })
            .then(voidValue => {
                return SdaDialogDelegateTools.readDialogDelegateStateVisitor(
                    pathFields.tenantId,
                    sessionVisitor.visitUserId()
                );
            })
            .then(dialogDelegateStateVisitor => {
                Log.info(
                    `${thisMethod} -- dialog delegate state before initializing: ${dialogDelegateStateVisitor.copyAsJsonString()}`
                );
                Log.info(
                    `${thisMethod} -- selected work packages count: ${
                        dialogDelegateStateVisitor.visitSelectedWorkPackageIds().length
                    }`
                );
                const loginVisitor = new LoginVisitor(body);
                dialogDelegateStateVisitor.visitAndSetBaseUrl(baseUrl);
                dialogDelegateStateVisitor.visitAndSetTenantId(pathFields.tenantId);
                dialogDelegateStateVisitor.visitAndSetSessionId(sessionVisitor.visitId());
                dialogDelegateStateVisitor.visitAndSetUserId(sessionVisitor.visitUserId());
                dialogDelegateStateVisitor.visitAndSetPassword(loginVisitor.visitPassword());
                // dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitAndClearRecords();
                return SdaDialogDelegateTools.writeDialogDelegateState(
                    pathFields.tenantId,
                    dialogDelegateStateVisitor
                ).then(nullValue => {
                    this._dialogDelegateStateVisitor = dialogDelegateStateVisitor;
                    return SdaDialogDelegateTools.showAllStorageKeys()
                        .then(voidValue2 => {
                            return SdaDialogDelegateTools.readDialogDelegateStateVisitor(
                                pathFields.tenantId,
                                sessionVisitor.visitUserId()
                            );
                        })
                        .then(freshDialogDelegateStateVisitor => {
                            Log.info(
                                `${thisMethod} -- dialog delegate state after initializing: ${freshDialogDelegateStateVisitor.copyAsJsonString()}`
                            );
                            Log.info(`${thisMethod} -- done initializing`);
                        });
                });
            });
    }

    private online(): boolean {
        return this._dialogDelegateStateVisitor.visitBriefcase().visitOnline();
    }

    private performBriefcaseWorkbenchActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
        const dialogRedirection = SdaPostBriefcaseWorkbenchActionJsonSample.copyOfResponse();
        DialogRedirectionVisitor.propagateDialogId(
            dialogRedirection,
            SdaDialogDelegateTools.OFFLINE_BRIEFCASE_DIALOG_ROOT_ID
        );
        DialogRedirectionVisitor.propagateTenantIdAndSessionId(
            dialogRedirection,
            pathFields.tenantId,
            pathFields.sessionId
        );
        return Promise.resolve(new JsonClientResponse(dialogRedirection, 303));
    }

    private performCreateSessionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performCreateSessionRequest';
        const pathFields = DialogProxyTools.deconstructPostSessionsPath(resourcePathElems);
        const loginVisitor = new LoginVisitor(body);
        return SdaDialogDelegateTools.readDialogDelegateStateVisitor(
            pathFields.tenantId,
            loginVisitor.visitUserId()
        ).then(delegateState => {
            if (!delegateState) {
                return null;
            }
            if (!delegateState.visitBriefcase().visitOnline()) {
                return SdaDialogDelegateTools.readOfflineSession(pathFields.tenantId, delegateState.visitUserId()).then(
                    offlineSessionVisitor => {
                        Log.info(
                            `${thisMethod} -- returning offline session: ${offlineSessionVisitor.copyAsJsonString()}`
                        );
                        return new JsonClientResponse(offlineSessionVisitor.enclosedJsonObject(), 200);
                    }
                );
            }
            return null;
        });
    }

    private performDeleteSessionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performDeleteSessionRequest';
        if (!this._dialogDelegateStateVisitor.visitBriefcase().visitOnline()) {
            const pathFields = DialogProxyTools.deconstructDeleteSessionPath(resourcePathElems);
            return Promise.resolve(
                new JsonClientResponse(SdaDialogDelegateTools.constructOfflineLogoutResponse(pathFields.sessionId), 200)
            );
        }
        return null;
    }

    private performEnterOfflineModeMenuActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel('Already offline');
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return this.captureOfflineWorkPackages(pathFields.tenantId, pathFields.sessionId).then(
            nullWorkPackagesValue => {
                return this.captureOfflineSession(baseUrl, pathFields.tenantId, pathFields.sessionId).then(
                    offlineSessionJcr => {
                        this._dialogDelegateStateVisitor.visitBriefcase().visitAndSetOnline(false);
                        return SdaDialogDelegateTools.writeDialogDelegateState(
                            pathFields.tenantId,
                            this._dialogDelegateStateVisitor
                        ).then(nullValue => {
                            const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(
                                pathFields.tenantId,
                                pathFields.sessionId
                            );
                            return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
                        });
                    }
                );
            }
        );
    }

    private performExitOfflineModeMenuActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        if (this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel('Already online');
            return Promise.resolve(new JsonClientResponse(dialogMessage, 400));
        }
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        return this.performLoginForOnlineProcessing(pathFields.tenantId).then(sessionJcr => {
            if (sessionJcr.statusCode !== 200) {
                return sessionJcr;
            }
            const sessionVisitor = new SessionVisitor(sessionJcr.value);
            this._dialogDelegateStateVisitor.visitAndClearSelectedWorkPackageIds();
            this._dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitAndClearRecords();
            this._dialogDelegateStateVisitor.visitBriefcase().visitAndSetOnline(true);
            return SdaDialogDelegateTools.writeDialogDelegateState(
                pathFields.tenantId,
                this._dialogDelegateStateVisitor
            ).then(nullValue => {
                const nullRedirection = SdaDialogDelegateTools.constructEnterOfflineModeNullRedirection(
                    pathFields.tenantId,
                    pathFields.sessionId
                );
                return Promise.resolve(new JsonClientResponse(nullRedirection, 303));
            });
        });
    }

    private performOfflineBriefcaseCommentsRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private performOfflineBriefcaseWorkPackagesRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        const response = RecordSetVisitor.emptyRecordSetVisitor().enclosedJsonObject();
        for (const id of this._dialogDelegateStateVisitor.visitSelectedWorkPackageIds()) {
            const workPackageVisitor = this._dialogDelegateStateVisitor
                .visitWorkPackagesRecordSet()
                .visitRecordAtId(id);
            if (workPackageVisitor) {
                RecordSetVisitor.addOrUpdateRecord(
                    response,
                    SelectedWorkPackageVisitor.createFromWorkPackageVisitor(workPackageVisitor)
                );
            } else {
                Log.warn(`${thisMethod} -- WARNING: Selected work package not found: ${id}`);
            }
        }
        return Promise.resolve(new JsonClientResponse(response, 200));
    }

    private async performOfflineDocumentContentRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performOfflineBriefcaseWorkPackagesRequest';
        const pathFields = DialogProxyTools.deconstructPostSessionContentPath(resourcePathElems);
        const sequence = ReadLargePropertyParametersVisitor.visitSequence(body);
        const largePropertyVisitor = await SdaDialogDelegateTools.readOfflineDocumentContentChunk(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.contentId,
            sequence
        );
        return new JsonClientResponse(largePropertyVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentOpenLatestFileMenuActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        const actionParameters = ActionParametersVisitor.visitTargetsValue(body);
        if (actionParameters.length !== 1) {
            return new JsonClientResponse(
                DialogProxyTools.constructDialogMessageModel('A single selection is required'),
                400
            );
        }
        const documentId = actionParameters[0];
        const contentRedirectionVisitor = await SdaDialogDelegateTools.readOfflineDocumentContentRedirection(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId,
            documentId
        );
        return new JsonClientResponse(contentRedirectionVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentsListRecordSetRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        const listRecordSetVisitor = await SdaDialogDelegateTools.readOfflineDocumentsListRecordSet(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(listRecordSetVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentsPropertiesRecordRequest(
        baseUrl: string,
        resourcePathElems: string[]
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructGetRecordPath(resourcePathElems);
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineDocumentsPropertiesRecord(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineDocumentsRootDialogRequest(
        baseUrl: string,
        resourcePathElems: string[]
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
        const rootDialogVisitor = await SdaDialogDelegateTools.readOfflineDocumentsRootDialog(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(rootDialogVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineShowTagsMenuActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        // HACK: Get work package id from dialog id
        // const actionParameters = ActionParametersVisitor.visitTargetsValue(body);
        // const workPackageId = actionParameters[0];
        const splitElems = pathFields.dialogId.split('_');
        const workPackageId = splitElems[3];
        const dialogRedirectionVisitor = await SdaDialogDelegateTools.readOfflineTagsRedirection(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            workPackageId
        );
        return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private async performOfflineTagsListRecordSetRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostRecordsPath(resourcePathElems);
        const listRecordSetVisitor = await SdaDialogDelegateTools.readOfflineTagsListRecordSet(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(listRecordSetVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineTagsPropertiesRecordRequest(
        baseUrl: string,
        resourcePathElems: string[]
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructGetRecordPath(resourcePathElems);
        const propertiesRecordVisitor = await SdaDialogDelegateTools.readOfflineTagsPropertiesRecord(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(propertiesRecordVisitor.enclosedJsonObject(), 200);
    }

    private async performOfflineTagsRootDialogRequest(
        baseUrl: string,
        resourcePathElems: string[]
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
        const rootDialogVisitor = await SdaDialogDelegateTools.readOfflineTagsRootDialog(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            pathFields.dialogId
        );
        return new JsonClientResponse(rootDialogVisitor.enclosedJsonObject(), 200);
    }

    private performOfflineWorkPackagesListRecordSetRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const sampleRecordSet = SdaPostWorkPackagesRecords1JsonSample.copyOfResponse();
        const recordSetVisitor = new RecordSetVisitor(sampleRecordSet);
        recordSetVisitor.visitAndClearRecords();
        recordSetVisitor.visitAndSetHasMore(false);
        for (const wpv of this._dialogDelegateStateVisitor.visitWorkPackagesRecordSet().visitRecords()) {
            if (wpv.visitBriefcase()) {
                recordSetVisitor.addOrUpdateRecord(wpv);
            }
        }
        return Promise.resolve(new JsonClientResponse(recordSetVisitor.enclosedJsonObject(), 200));
    }

    private async performOfflineWorkPackagesOpenMenuActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostMenuActionPath(resourcePathElems);
        const actionParameters = ActionParametersVisitor.visitTargetsValue(body);
        if (actionParameters.length !== 1) {
            return new JsonClientResponse(
                DialogProxyTools.constructDialogMessageModel('A single selection is required'),
                400
            );
        }
        const workPackageId = actionParameters[0];
        const dialogRedirectionVisitor = await SdaDialogDelegateTools.readOfflineDocumentsRedirection(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId(),
            workPackageId
        );
        return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
    }

    private performOfflineWorkPackagesRootDialogRequest(
        baseUrl: string,
        resourcePathElems: string[]
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructGetDialogPath(resourcePathElems);
        return SdaDialogDelegateTools.readOfflineWorkPackagesRootDialog(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId()
        ).then(rootDialogVisitor => {
            return new JsonClientResponse(rootDialogVisitor.enclosedJsonObject(), 200);
        });
    }

    private performOfflineWorkPackagesWorkbenchActionRequest(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const pathFields = DialogProxyTools.deconstructPostWorkbenchActionPath(resourcePathElems);
        return SdaDialogDelegateTools.readOfflineWorkPackagesRedirection(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor.visitUserId()
        ).then(dialogRedirectionVisitor => {
            return new JsonClientResponse(dialogRedirectionVisitor.enclosedJsonObject(), 303);
        });
    }

    private performWorkPackagesAddWorkPackageToBriefcase(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performWorkPackagesAddWorkPackageToBriefcase';
        // REQUIRED: Before we can add a Work Package to the briefcase, we must be online
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel(
                'Cannot add a Work Package to the briefcase while offline'
            );
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
        return SdaDialogDelegateTools.writeDialogDelegateState(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor
        ).then(nullValue => {
            return new JsonClientResponse(
                SdaDialogDelegateTools.constructAddToBriefcaseNullRedirection(
                    pathFields.tenantId,
                    pathFields.sessionId,
                    pathFields.dialogId
                ),
                303
            );
        });
    }

    private performWorkPackagesRemoveWorkPackageFromBriefcase(
        baseUrl: string,
        resourcePathElems: string[],
        body?: StringDictionary
    ): Promise<JsonClientResponse> {
        const thisMethod = 'SdaDialogDelegate::performWorkPackagesRemoveWorkPackageFromBriefcase';
        // REQUIRED: Before we can remove a Work Package from the briefcase, we must be online
        if (!this.online()) {
            const dialogMessage = DialogProxyTools.constructDialogMessageModel(
                'Cannot remove a Work Package from the briefcase while offline'
            );
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
        return SdaDialogDelegateTools.writeDialogDelegateState(
            pathFields.tenantId,
            this._dialogDelegateStateVisitor
        ).then(nullValue => {
            return new JsonClientResponse(
                SdaDialogDelegateTools.constructRemoveFromBriefcaseNullRedirection(
                    pathFields.tenantId,
                    pathFields.sessionId,
                    pathFields.dialogId
                ),
                303
            );
        });
    }
}
