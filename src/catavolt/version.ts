import moment from 'moment-timezone';
import {Catavolt} from "./dialog/Catavolt"

export const CATAVOLT_SDK_VERSION:string = '4.27.1';

(()=>{
    Catavolt.addStaticDeviceProp('catavoltSdkVersion', CATAVOLT_SDK_VERSION);
    Catavolt.addDynamicDeviceProp('deviceTime', ()=>moment(new Date()).format());
    Catavolt.addDynamicDeviceProp('deviceTimeZone', ()=>moment.tz.guess());
})();
