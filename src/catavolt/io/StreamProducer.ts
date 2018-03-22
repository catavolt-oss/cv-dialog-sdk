export interface StreamProducer {
    // modeled after StreamProducer (when done is true, value will be undefined)
    read(): Promise<{ done: boolean; value: any }>;
}
