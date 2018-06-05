import {ClientEvent} from "./ClientEvent";

export type ClientListener = (clientEvent: ClientEvent) => void;
