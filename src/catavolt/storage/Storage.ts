export interface Storage {

    getItem(key: string):Promise<string>;

    getJson(key: string):Promise<any>;

    setItem(key: string, value: string):Promise<void>;

    setJson(key: string, value: any):Promise<void>;

    removeItem(key: string):Promise<void>;

    clearAll():Promise<void>;

    getAllKeys():Promise<string[]>;

    multiRemove(keys: Array<string>):Promise<void>;

}

