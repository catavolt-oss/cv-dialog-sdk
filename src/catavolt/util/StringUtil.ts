/**
 * Created by rburson on 4/3/15.
 */
export class StringUtil {

    static splitSimpleKeyValuePair(pairString:string):Array<string> {
        var pair:Array<string> = pairString.split(':');
        var code = pair[0];
        var desc = pair.length > 1 ? pair[1] : '';
        return [code, desc];
    }
}
