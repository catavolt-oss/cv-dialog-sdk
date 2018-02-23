import {Redirection} from "./Redirection";

export interface DialogRedirection extends Redirection {

    readonly dialogDescription: string;
    readonly dialogId: string;

}
