export class UserMessage {

    constructor(public message: string,
                public messageType: string,
                public explanation: string,
                public propertyNames: string[]) {
    }
}
