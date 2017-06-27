import {AppContext} from "./dialog"
import * as moment from 'moment-timezone';

export const CATAVOLT_SDK_VERSION:string = '1.1.29';

(()=>{
    AppContext.singleton.addDynamicDeviceProp(():string=>{ return 'platform:browser'});
    AppContext.singleton.addStaticDeviceProp('catavoltSdkVersion:' + CATAVOLT_SDK_VERSION);
    AppContext.singleton.addDynamicDeviceProp(():string=>{ return 'deviceTime:' +  (new Date()).toISOString()});
    AppContext.singleton.addDynamicDeviceProp(():string=>{ return 'deviceTimeZone:' +  moment.tz.guess()});
})();
