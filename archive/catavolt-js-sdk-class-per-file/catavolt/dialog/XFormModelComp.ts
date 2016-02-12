/**
 * Created by rburson on 3/31/15.
 */

import {DialogRedirection} from './DialogRedirection';

export class XFormModelComp {

    constructor(public paneId:string,
                public redirection:DialogRedirection,
                public label:string,
                public title:string) {
    }

}
