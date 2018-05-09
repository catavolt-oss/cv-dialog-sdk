import { BlobClientResponse } from '../client/BlobClientResponse';
import { Client } from '../client/Client';
import { JsonClientResponse } from '../client/JsonClientResponse';
import { TextClientResponse } from '../client/TextClientResponse';
import { VoidClientResponse } from '../client/VoidClientResponse';
import { StreamProducer } from '../io/StreamProducer';
import { StringDictionary } from '../util/StringDictionary';

export interface DialogDelegate extends Client {
    initialize(): Promise<void>;

    handleGetBlobResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<BlobClientResponse>
    ): Promise<BlobClientResponse> | null;

    handleGetTextResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<TextClientResponse>
    ): Promise<TextClientResponse> | null;

    handleOpenStreamResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<StreamProducer>
    ): Promise<StreamProducer> | null;

    handlePostMultipartResponse<T>(
        baseUrl: string,
        resourcePath: string,
        formData: FormData,
        response: Promise<VoidClientResponse>
    ): Promise<VoidClientResponse> | null;

    handleGetJsonResponse(
        baseUrl: string,
        resourcePath: string,
        queryParams: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null;

    handlePostJsonResponse(
        baseUrl: string,
        resourcePath: string,
        body: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null;

    handlePutJsonResponse(
        baseUrl: string,
        resourcePath: string,
        body: StringDictionary,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null;

    handleDeleteJsonResponse(
        baseUrl: string,
        resourcePath: string,
        response: Promise<JsonClientResponse>
    ): Promise<JsonClientResponse> | null;
}
