import {ClientEventType} from "./ClientEventType";

export interface ClientEvent {
    message: string;
    eventType: ClientEventType;
}
