/* tslint:disable */


/*
    This implementation expects javascript strings (UTF-16) but operates on UTF-8 chars
    It will break if given characters out of range.  Use another method to encodeString binary data directly (i.e. ArrayBuffer)
    https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/30106551
 */
export class Base64 {

    public static encodeString(str) {
        return btoa(str);
    }

    public static decodeString(str) {
       return atob(str);
    }

}
