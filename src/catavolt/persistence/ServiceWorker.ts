import {PersistenceTools} from "./PersistenceTools";
const ThisCacheName = 'v0.170';
const ActiveCacheNames = [ThisCacheName];
const MessagePrefix = `[Catavolt ServiceWorker ${ThisCacheName} ${(new Date()).toLocaleString()}]`;
let fetchCount = 0;

console.log(`${MessagePrefix} Begin "service-worker" script at: ${self}`);
self.addEventListener('install', event => ServiceWorker.install(event));
self.addEventListener('activate', event => ServiceWorker.activate(event));
self.addEventListener('fetch', event => ServiceWorker.fetchAndStore(event));
console.log(`${MessagePrefix} End "service-worker" script at: ${self}`);

export class ServiceWorker {

    public static activate(event) {
        console.log(`${MessagePrefix} Begin activate() method`);
        console.log(`${MessagePrefix} activate() begin active cache names:`);
        for (let i = 0; i < ActiveCacheNames.length; i++) {
            console.log(`${MessagePrefix} activate() active cache name: ${ActiveCacheNames[i]}`);
        }
        console.log(`${MessagePrefix} activate() end active cache names`);
        event.waitUntil(
            caches.keys().then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (ActiveCacheNames.indexOf(key) === -1) {
                        console.log(`${MessagePrefix} activate() deleting expired cache: ${key}`);
                        return caches.delete(key);
                    }
                }));
            })
        );
        console.log(`${MessagePrefix} End activate() method`);
    }

    public static fetchAndStore(event) {
        const url = new URL(event.request.url);
        const pathname = url.pathname.length > 0 ? url.pathname.slice(1) : url.pathname;
        const path = pathname.split('/');
        if (event.request.method !== 'GET') {
            return fetch(event.request.clone());
        }
        // Slice off version number before passing path to PersistenceTools
        // Do NOT cache dialog requests, that is the responsibility of the persistence module
        if (path.length > 0 && ServiceWorker.isDialogRequest(path.slice(1))) {
            return fetch(event.request.clone());
        }
        fetchCount++;
        const thisFetchId = fetchCount;
//        console.log(`${MessagePrefix} Begin fetchAndStore() ${thisFetchId} request: ${event.request.method} ${event.request.url}`);
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
//                    console.log(`${MessagePrefix} fetchAndStore() ${thisFetchId} response found in cache: ${event.request.url}`);
                    return cachedResponse;
                }
                const requestToCache = event.request.clone();
                return fetch(requestToCache).then(fetchResponse => {
                    if (!fetchResponse) {
                        console.log(`${MessagePrefix} fetchAndStore() ${thisFetchId} response NOT valid and NOT cached: ${requestToCache.url}`);
                        return fetchResponse;
                    }
                    const responseToCache = fetchResponse.clone();
                    caches.open(ThisCacheName).then(cache => {
                        cache.put(requestToCache, responseToCache);
                        console.log(`${MessagePrefix} fetchAndStore() ${thisFetchId} response cached for request: ${requestToCache.url}`);
                    });
                    return fetchResponse;
                });
            })
        );
//        console.log(`${MessagePrefix} End fetchAndStore() ${thisFetchId} request: ${event.request.method} ${event.request.url}`);
    }

    public static fetchFromCache(event) {
        const url = new URL(event.request.url);
        const pathname = url.pathname.length > 0 ? url.pathname.slice(1) : url.pathname;
        const path = pathname.split('/');
        if (event.request.method !== 'GET') {
            return fetch(event.request.clone());
        }
        // Slice off version number before passing path to PersistenceTools
        // Do NOT cache dialog requests, that is the responsibility of the persistence module
        if (path.length > 0 && ServiceWorker.isDialogRequest(path.slice(1))) {
            return fetch(event.request.clone());
        }
        fetchCount++;
        const thisFetchId = fetchCount;
        console.log(`${MessagePrefix} Begin fetchFromCache() ${thisFetchId} request: ${event.request.method} ${event.request.url}`);
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                console.log(`${MessagePrefix} fetchFromCache() ${thisFetchId} response NOT found in cache: ${event.request.url}`);
                return fetch(event.request.clone());
            })
        );
        console.log(`${MessagePrefix} End fetchFromCache() ${thisFetchId} request: ${event.request.method} ${event.request.url}`);
    }

    /*
    * TODO: Try and load ALL static resources here. Then change the caching
    *       policy to just lookup resources, not fetch-and-cache.
    */
    public static install(event) {

        /*
        index.html?_ijt=q2qt7grsg7hlalpl1ucuiikgha
        index.html?_ijt=q2qt7grsg7hlalpl1ucuiikgha#/?_k=4yjrco
        https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
        https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=31.3&action=apiboot2&libraries=places&e=10_1_0,10_2_0&rt=main.8
        https://maps.googleapis.com/maps/api/js?key=AIzaSyAhjgN93480H8FYcUFeqBrLofxaT4PTEZU&libraries=places
        https://maps.googleapis.com/maps-api-v3/api/js/31/3/common.js
        https://maps.googleapis.com/maps-api-v3/api/js/31/3/util.js
        https://maps.googleapis.com/maps-api-v3/api/js/31/3/stats.js
        https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css
        https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/object/catavolt.png
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/gml/comment.png
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/gml/Document.png
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/gml/File.png
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/images/Scan2.png
        https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/images/WorkOrder2.png
        */

        console.log(`${MessagePrefix} Begin install() method`);
        event.waitUntil(
            caches.open(ThisCacheName).then(cache => {
                const resourceList = [
                    'index.html',
                    'bundle.js',
                    'ag-grid/ag-grid.css',
                    'ag-grid/theme-fresh.css',
                    'css/app.css',
                    'css/animate.css',
                    'css/bootstrap.min.css',
                    'css/custom-app.css',
                    'css/custom-theme.min.css',
                    'css/toastr.min.css',
                    'fonts/glyphicons-halflings-regular.woff2',
                    'img/intergraph_background.jpg',
                    'img/login_logo.png',
                    'img/logo.png',
                    'img/top-bar.jpg',
                    'lib/bootstrap.min.js',
                    'lib/toastr.min.js',
                    'react-widgets/css/react-widgets.css',
                ];
                console.log(`${MessagePrefix} install() adding resources to cache: ${resourceList}`);
                return cache.addAll(resourceList);
            })
        );
        console.log(`${MessagePrefix} End install() method`);
    }

    public static isDialogRequest(path: string[]): boolean {
        return path.length > 3 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS;
    }

}
