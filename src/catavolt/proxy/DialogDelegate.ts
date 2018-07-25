import {BlobClientResponse} from "../client/BlobClientResponse";
import {JsonClientResponse} from "../client/JsonClientResponse";
import {TextClientResponse} from "../client/TextClientResponse";
import {VoidClientResponse} from "../client/VoidClientResponse";
import {StreamProducer} from "../io/StreamProducer";
import {DialogProxy} from "./DialogProxy";
import {DialogRequest} from "./DialogRequest";

export interface DialogDelegate {

    initialize(dialogProxy: DialogProxy): Promise<void>;

    isOnline(userInfo:{}): Promise<boolean>;

    getBlob(request: DialogRequest): Promise<BlobClientResponse>;

    getText(request: DialogRequest): Promise<TextClientResponse>;

    openStream(request: DialogRequest): Promise<StreamProducer>;

    postMultipart<T>(request: DialogRequest): Promise<VoidClientResponse>;

    getJson(request: DialogRequest): Promise<JsonClientResponse>;

    postJson(request: DialogRequest): Promise<JsonClientResponse>;

    putJson(request: DialogRequest): Promise<JsonClientResponse>;

    deleteJson(request: DialogRequest): Promise<JsonClientResponse>;

    handleGetBlobResponse(request: DialogRequest, response: Promise<BlobClientResponse>): Promise<BlobClientResponse> | null;

    handleGetTextResponse(request: DialogRequest, response: Promise<TextClientResponse>): Promise<TextClientResponse> | null;

    handleOpenStreamResponse(request: DialogRequest, response: Promise<StreamProducer>): Promise<StreamProducer> | null;

    handlePostMultipartResponse<T>(request: DialogRequest, response: Promise<VoidClientResponse>): Promise<VoidClientResponse> | null;

    handleGetJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null;

    handlePostJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null;

    handlePutJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null;

    handleDeleteJsonResponse(request: DialogRequest, response: Promise<JsonClientResponse>): Promise<JsonClientResponse> | null;

}
