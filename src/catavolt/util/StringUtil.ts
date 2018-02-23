/**
 * *****************************************************
 */
export class StringUtil {

    static splitSimpleKeyValuePair(pairString: string): Array<string> {
        var index = pairString.indexOf(':');
        let code = null
        let desc = ''
        if (index > -1) {
            if (index > 0) code = pairString.substr(0, index)
            desc = pairString.length > index ? pairString.substr(index + 1) : ''
        } else {
            code = pairString;
        }
        return [code, desc];
    }

    static hashCode(s: string) {
        var hash = 0, i, chr, len;
        if (s.length === 0) return hash;
        for (i = 0, len = s.length; i < len; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    static endsWith(subjectString: string, searchString: string, position?: number): boolean {
        if (typeof position !== 'number' || !isFinite(position) ||
            Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
}
