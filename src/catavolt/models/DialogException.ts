import {UserMessage} from "./UserMessage";

export class DialogException {

    constructor(public iconName?: string,
                public message?: string,
                public name?: string,
                public stackTrace?: string,
                public title?: string,
                public cause?: DialogException,
                public userMessages?: UserMessage[]) {
    }

}
