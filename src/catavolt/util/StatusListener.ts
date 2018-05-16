import {StatusType} from "./StatusType";

export type StatusListener = (status: { message: string; type:StatusType}) => void;

