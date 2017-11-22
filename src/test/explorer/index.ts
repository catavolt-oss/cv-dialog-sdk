/**
 * Created by rburson on 8/28/17.
 */

import {Log, LogLevel} from '../../catavolt'
Log.logLevel(LogLevel.DEBUG);

export class Explorer {

    constructor() {}

    public static explore():Explorer {
        Log.debug('Exploring....')
        return new Explorer();
    }

}

Explorer.explore();

