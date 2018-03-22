export type StreamConsumer = (chunk: { done: boolean; value: any }) => void;
