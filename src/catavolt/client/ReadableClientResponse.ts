
export interface ReadableClientResponse {

    // modeled after ReadableStream (when done is true, value will be undefined)
    read(): Promise<{ done: boolean, value: any }>;

}
