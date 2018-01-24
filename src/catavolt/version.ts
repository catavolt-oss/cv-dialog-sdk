import {Catavolt} from "./dialog"
import * as moment from 'moment-timezone';

export const CATAVOLT_SDK_VERSION:string = '2.0.0';

(()=>{
    Catavolt.singleton.addStaticDeviceProp('catavoltSdkVersion', CATAVOLT_SDK_VERSION);
    Catavolt.singleton.addDynamicDeviceProp('platform', ()=>'browser');
    Catavolt.singleton.addDynamicDeviceProp('deviceTime', ()=>moment(new Date()).format());
    Catavolt.singleton.addDynamicDeviceProp('deviceTimeZone', ()=>moment.tz.guess());
})();
