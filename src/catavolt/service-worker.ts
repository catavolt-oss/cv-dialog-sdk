
import {PersistenceTools} from "./persistence-tools";

const MessagePrefix = `[Catavolt ServiceWorker ${(new Date()).toLocaleString()}]`;

if (typeof self !== 'undefined' && (typeof window === 'undefined' || self !== window)) {
    console.log(`${MessagePrefix} loading at: ${self}`);
    console.log(`${MessagePrefix} adding "install" listener`);
    self.addEventListener('install', event => {
        ServiceWorker.install();
    });
    console.log(`${MessagePrefix} adding "fetch" listener`);
    self.addEventListener('fetch', event => {
        ServiceWorker.fetch(event);
    });
    console.log(`${MessagePrefix} loading completed`);
} else {
    console.log(`${MessagePrefix} cannot load at: ${self}`);
}

export class ServiceWorker {

    public static install() {
        console.log(`${MessagePrefix} install() completed successfully`)
    }

    public static fetch(event) {
        console.log(`${MessagePrefix} fetch() intercepted request: ${event.request.url}`);
    }

}
