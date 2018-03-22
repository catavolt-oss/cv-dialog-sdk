import { Storage } from './Storage';

enum ApiType {
    LOCAL_STORAGE,
    ASYNC_STORAGE
}

export const setCvStorageApi = storageApi => {
    ClientStorage.setStorageApi(storageApi);
};

class ClientStorage implements Storage {
    private static _storageApi;
    // default to window.localStorage
    private static _type: ApiType = ApiType.LOCAL_STORAGE;

    public static setStorageApi(storageApi) {
        ClientStorage._storageApi = storageApi;
        if (ClientStorage._storageApi) {
            if (ClientStorage._storageApi.getAllKeys) {
                // Assume AsyncStorage
                ClientStorage._type = ApiType.ASYNC_STORAGE;
            } else {
                // Assume window.localStorage
                ClientStorage._type = ApiType.LOCAL_STORAGE;
            }
        }
    }

    public getItem(key: string): Promise<string> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.getItemAsyncStorage(key, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public getJson(key: string): Promise<any> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.getJsonAsyncStorage(key, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public setItem(key: string, value: string): Promise<void> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.setItemAsyncStorage(key, value, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public setJson(key: string, value: any): Promise<void> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.setJsonAsyncStorage(key, value, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public removeItem(key: string): Promise<void> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.removeItemAsyncStorage(key, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public clearAll(): Promise<void> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.clearAllAsyncStorage(ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public getAllKeys(): Promise<string[]> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.getAllKeysAsyncStorage(ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    public multiRemove(keys: Array<string>): Promise<void> {
        if (ClientStorage._type === ApiType.ASYNC_STORAGE) {
            return this.multiRemoveAsyncStorage(keys, ClientStorage._storageApi);
        } else if (ClientStorage._type === ApiType.LOCAL_STORAGE) {
            // @TODO
        }
    }

    private getItemAsyncStorage(key: string, api) {
        return api.getItem(key);
    }

    private getJsonAsyncStorage(key: string, api) {
        return api.getItem(key).then(value => {
            try {
                return JSON.parse(value);
            } catch (err) {
                throw new Error(`Storage::getItem('${key}') parse JSON failed for: ${value}`);
            }
        });
    }

    private setItemAsyncStorage(key: string, value: string, api) {
        return api.setItem(key, value);
    }

    private setJsonAsyncStorage(key: string, value: any, api) {
        let stringVal = null;
        try {
            stringVal = JSON.stringify(value);
        } catch (err) {
            return Promise.reject(new Error(`Storage::setItem(${key}) failed to stringify JSON value`));
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

export const storage: Storage = new ClientStorage();
