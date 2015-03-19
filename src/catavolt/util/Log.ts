/**
 * Created by rburson on 3/6/15.
 */

module catavolt.util {

    export class Log {

        static info(message: string, obj?: string, method?: string) {
            if(obj || method) {
                console.log(obj + "::" + method + " : " + message);
            }else{
                console.log(message);
            }
        }

        static error(message: string, obj?: string, method?: string) {
            if(obj || method) {
                console.error(obj + "::" + method + " : " + message);
            }else{
                console.error(message);
            }
        }

        static formatRecString(o): string {
           return o;
        }

    }
}

