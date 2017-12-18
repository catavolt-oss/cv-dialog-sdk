
import {PersistenceTools} from "./persistence-tools";

const MessagePrefix = `[Catavolt ServiceWorker ${(new Date()).toLocaleString()}]`;
const CacheName = 'catavolt.tenants';

console.log(`${MessagePrefix} loading at: ${self}`);
console.log(`${MessagePrefix} adding "install" listener`);
self.addEventListener('install', event => {
    ServiceWorker.install(event);
});
console.log(`${MessagePrefix} adding "fetch" listener`);
self.addEventListener('fetch', event => {
    ServiceWorker.fetch(event);
});
console.log(`${MessagePrefix} loading completed`);

export class ServiceWorker {

    public static install(event) {
        event.waitUntil(() => {
            caches.open(CacheName).then(cache => cache.addAll([
                'bundle.js',
                'application.png'
            ]));
        });
        console.log(`${MessagePrefix} install() completed`);
    }

    public static fetch(event) {
        console.log(`${MessagePrefix} fetch() intercepted request: ${event.request.url}`);
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    console.log(`${MessagePrefix} fetch() reponse found in cache: ${event.request.url}`);
                    return cachedResponse;
                }
                var requestToCache = event.request.clone();
                return fetch(requestToCache).then(fetchResponse => {
                    if (!fetchResponse || fetchResponse.status !== 200) {
                        return fetchResponse;
                    }
                    var responseToCache = fetchResponse.clone();
                    caches.open(CacheName).then(cache => {
                        console.log(`${MessagePrefix} fetch() successfully cached response from: ${requestToCache.url}`);
                        cache.put(requestToCache, responseToCache);
                    });
                    return fetchResponse;
                });
            })
        );
    }

}
