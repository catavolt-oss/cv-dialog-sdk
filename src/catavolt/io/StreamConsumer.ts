export type StreamConsumer = (chunk: { done: boolean; value: any }) => Promise<void>;
