import { StreamConsumer } from './StreamConsumer';
import { StreamProducer } from './StreamProducer';

export class Pump {
    constructor(private consumer: StreamConsumer, private producer: StreamProducer) {}

    public start(): Promise<void> {
        const f: StreamConsumer = (result: { done: boolean; value: any }) => {
            this.consumer(result);
            if (result.done) {
                return Promise.resolve();
            } else {
                return this.producer.read().then(f);
            }
        };
        return this.producer.read().then(f);
    }
}
