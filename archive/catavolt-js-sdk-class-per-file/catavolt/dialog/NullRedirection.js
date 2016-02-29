/**
 * Created by rburson on 3/17/15.
 */
import { Redirection } from "./Redirection";
export class NullRedirection extends Redirection {
    constructor(fromDialogProperties) {
        super();
        this.fromDialogProperties = fromDialogProperties;
    }
}
