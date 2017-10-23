import {AppContext} from "./dialog"
import * as moment from 'moment-timezone';

export const CATAVOLT_SDK_VERSION:string = '1.1.35';

(()=>{
    AppContext.singleton.addStaticDeviceProp('catavoltSdkVersion', CATAVOLT_SDK_VERSION);
    AppContext.singleton.addDynamicDeviceProp('platform', ()=>'browser');
    AppContext.singleton.addDynamicDeviceProp('deviceTime', ()=>moment(new Date()).format());
    AppContext.singleton.addDynamicDeviceProp('deviceTimeZone', ()=>moment.tz.guess());
})();
