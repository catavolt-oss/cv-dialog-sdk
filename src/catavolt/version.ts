import {AppContext} from "./dialog"
import * as moment from 'moment-timezone';

export const CATAVOLT_SDK_VERSION:string = '1.1.24';

(()=>{
    AppContext.singleton.addStaticDeviceProp('catavoltSdkVersion:' + CATAVOLT_SDK_VERSION);
    AppContext.singleton.addDynamicDeviceProp(():string=>{ return 'DeviceTime:' +  (new Date()).toTimeString()});
    AppContext.singleton.addDynamicDeviceProp(():string=>{ return 'DeviceTimeZone:' +  moment.tz.guess()});
})();
