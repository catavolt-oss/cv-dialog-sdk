export abstract class ClientResponse<T> {
    constructor(readonly value: T, readonly statusCode: number) {}
}
