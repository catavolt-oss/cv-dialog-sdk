import {CatavoltApi} from "./dialog"
import * as moment from 'moment-timezone';

export const CATAVOLT_SDK_VERSION:string = '3.0.0';

(()=>{
    CatavoltApi.singleton.addStaticDeviceProp('catavoltSdkVersion', CATAVOLT_SDK_VERSION);
    CatavoltApi.singleton.addDynamicDeviceProp('platform', ()=>'browser');
    CatavoltApi.singleton.addDynamicDeviceProp('deviceTime', ()=>moment(new Date()).format());
    CatavoltApi.singleton.addDynamicDeviceProp('deviceTimeZone', ()=>moment.tz.guess());
})();
