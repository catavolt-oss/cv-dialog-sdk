enum ApiType {
    LOCAL_STORAGE, ASYNC_STORAGE
}

export class Storage {

    private static _storageApi;
    private _type: ApiType;

    public static setStorageApi(storageApi) {
        Storage._storageApi = storageApi;
    }

    constructor() {
        this.initStorageApi();
    }

    public getItem(key: string) {
        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.getItemAsyncStorage(key, Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public setItem(key: string, value: any) {
        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.setItemAsyncStorage(key, value, Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public removeItem(key: string) {
        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.removeItemAsyncStorage(key, Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public clearAll() {
        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.clearAllAsyncStorage(Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public getAllKeys() {
        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.getAllKeysAsyncStorage(Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public multiRemove(keys: Array<string>) {

        if (this._type === ApiType.ASYNC_STORAGE) {
            return this.multiRemoveAsyncStorage(keys, Storage._storageApi);
        } else if (this._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    private initStorageApi() {
        if (Storage._storageApi) {
            if (Storage._storageApi.getAllKeys) {
                // Assume AsyncStorage
                this._type = ApiType.ASYNC_STORAGE;
            } else {
                // Assume window.localStorage
                this._type = ApiType.LOCAL_STORAGE;
            }
        } else {
            // Try for window.localStorage
            if (window.localStorage) {
                this._type = ApiType.LOCAL_STORAGE;
            } else {
                throw new Error("No Storage Api specified for Storage");
            }
        }
    }

    private getItemAsyncStorage(key: string, api) {
        return api.getItem(key).then((value) => {
            try {
                return JSON.parse(value);
            } catch (err) {
                throw new Error(`Storage::getItem('${key}') parse JSON failed for: ${value}`);
            }
        });
    }

    private setItemAsyncStorage(key: string, value: any, api) {
        let stringVal = null;
        try {
            stringVal = JSON.stringify(value);
        } catch (err) {
            return Promise.reject(new Error(`Storage::setItem(${key}) failed to stringify JSON value`))
        }
        return api.setItem(key, stringVal);
    }

    private removeItemAsyncStorage(key: string, api) {
        return api.removeItem(key);
    }

    private clearAllAsyncStorage(api) {
        return api.clear();
    }

    private getAllKeysAsyncStorage(api) {
        return api.getAllKeys();
    }

    private multiRemoveAsyncStorage(keys: Array<string>, api) {
        return api.multiRemove(keys);
    }
}
