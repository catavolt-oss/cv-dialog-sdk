/**
 * Created by rburson on 4/3/15.
 */

///<reference path="../references.ts"/>

module catavolt.util {

    export class StringUtil {

        static splitSimpleKeyValuePair(pairString:string):Array<string> {
            var index = pairString.indexOf(':');
            let code = ''
            let desc = ''
            if(index > -1) {
                code = pairString.substr(0, index)
                desc = pairString.length > index ? pairString.substr(index + 1) : ''
            }
            return [code, desc];
        }
    }
}