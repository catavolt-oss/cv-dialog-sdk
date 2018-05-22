import { Storage } from './Storage';

export const setCvStorageApi = storageApi => {
    ClientStorage.setStorageApi(storageApi);
};

class ClientStorage implements Storage {
    private static _storage:Storage;

    public static setStorageApi(storageApi) {
        if (storageApi) {
            if (storageApi.getAllKeys) {
                // Assume AsyncStorage
                ClientStorage._storage = new AsyncStorageAdapter(storageApi);
            } else {
                // Assume window.localStorage
                ClientStorage._storage = new LocalStorageAdapter(storageApi);
            }
        }
    }

    constructor() {
        // Attempt to set the default storage backend to localStorage
        if (!ClientStorage._storage) {
            if  (typeof(localStorage) !== 'undefined') {
                if (localStorage && localStorage.getItem) {
                    ClientStorage.setStorageApi(localStorage);
                }
            }
        }
    }

    public getItem(key: string): Promise<string> {
        return ClientStorage._storage.getItem(key);
    }

    public getJson(key: string): Promise<any> {
        return ClientStorage._storage.getJson(key);
    }

    public setItem(key: string, value: string): Promise<void> {
        return ClientStorage._storage.setItem(key, value);
    }

    public setJson(key: string, value: any): Promise<void> {
        return ClientStorage._storage.setJson(key, value);
    }

    public removeItem(key: string): Promise<void> {
        return ClientStorage._storage.removeItem(key);
    }

    public clearAll(): Promise<void> {
        return ClientStorage._storage.clearAll();
    }

    public getAllKeys(): Promise<string[]> {
        return ClientStorage._storage.getAllKeys();
    }

    public multiRemove(keys: Array<string>): Promise<void> {
        return ClientStorage._storage.multiRemove(keys);
    }

}

class AsyncStorageAdapter implements Storage {

    constructor(readonly api:any){}

    public getItem(key: string) {
        return this.api.getItem(key);
    }

    public getJson(key: string) {
        return this.api.getItem(key).then(value => {
            try {
                return JSON.parse(value);
            } catch (err) {
                throw new Error(`Storage::getItem('${key}') parse JSON failed for: ${value}`);
            }
        });
    }

    public setItem(key: string, value: string) {
        return this.api.setItem(key, value);
    }

    public setJson(key: string, value: any) {
        let stringVal = null;
        try {
            stringVal = JSON.stringify(value);
        } catch (err) {
            return Promise.reject(new Error(`Storage::setItem(${key}) failed to stringify JSON value`));
        }
        return this.api.setItem(key, stringVal);
    }

    public removeItem(key: string) {
        return this.api.removeItem(key);
    }

    public clearAll() {
        return this.api.clear();
    }

    public getAllKeys() {
        return this.api.getAllKeys();
    }

    public multiRemove(keys: Array<string>) {
        return this.api.multiRemove(keys);
    }
}

class LocalStorageAdapter implements Storage {

    constructor(readonly api){}

    public getItem(key: string):Promise<string> {
        return new Promise((resolve, reject) => {
           try {
               const value:string = this.api.getItem(key);
               resolve(value);
           } catch (e) {
               reject(e);
           }
        });
    }

    public getJson(key: string):Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(JSON.parse(this.api.getItem(key)));
            } catch (err) {
                reject(Error(`Storage::getItem('${key}') parse JSON failed`));
            }
        });
    }

    public setItem(key: string, value: string):Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.api.setItem(key, value));
            } catch (e) {
                reject(e);
            }
        });
    }

    public setJson(key: string, value: any):Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const stringVal = JSON.stringify(value);
                resolve(this.api.setItem(key, stringVal));
            } catch (e) {
                reject(e);
            }
        });
    }

    public removeItem(key: string):Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.api.removeItem(key));
            } catch (e) {
                reject(e);
            }
        });
    }

    public clearAll():Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.api.clear());
            } catch (e) {
                reject(e);
            }
        });
    }

    public getAllKeys():Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                const keys:Array<string> = [];
                for(let i:number = 0; i < this.api.length; i++) {
                   keys.push(this.api.key(i));
                }
                resolve(keys);
            } catch (e) {
                reject(e);
            }
        });
    }

    public multiRemove(keys: Array<string>):Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                keys.forEach((key) => {
                    this.api.removeItem(key);
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}

export const storage: Storage = new ClientStorage();

