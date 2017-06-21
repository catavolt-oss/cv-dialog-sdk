import {AppContext} from "./dialog"

export const CATAVOLT_SDK_VERSION:string = '1.1.24';

(()=>{
    AppContext.singleton.deviceProps.push('catavoltSdkVersion:' + CATAVOLT_SDK_VERSION);
})();
