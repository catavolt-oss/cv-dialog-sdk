/**
 * Created by rburson on 3/16/15.
 */

module catavolt.util {

    /* @TODO - extend this with UserMessage? */
    export interface UserException {

        iconName:string;
        message:string;
        name:string;
        stackTrace:string;
        title:string;
    }
}
