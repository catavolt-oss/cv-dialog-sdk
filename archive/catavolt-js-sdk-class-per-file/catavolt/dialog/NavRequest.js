/**
 * Created by rburson on 3/17/15.
 */
import { ObjUtil } from "../util/ObjUtil";
import { Future } from "../fp/Future";
import { WebRedirection } from "./WebRedirection";
import { WorkbenchRedirection } from "./WorkbenchRedirection";
import { AppContext } from "./AppContext";
import { DialogRedirection } from "./DialogRedirection";
import { FormContextBuilder } from "./FormContextBuilder";
import { NullRedirection } from "./NullRedirection";
import { NullNavRequest } from "./NullNavRequest";
export class NavRequestUtil {
    static fromRedirection(redirection, actionSource, sessionContext) {
        var result;
        if (redirection instanceof WebRedirection) {
            result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        }
        else if (redirection instanceof WorkbenchRedirection) {
            var wbr = redirection;
            result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map((wb) => {
                return wb;
            });
        }
        else if (redirection instanceof DialogRedirection) {
            var dr = redirection;
            var fcb = new FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        }
        else if (redirection instanceof NullRedirection) {
            var nullRedir = redirection;
            var nullNavRequest = new NullNavRequest();
            ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
            result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        }
        else {
            result = Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
        }
        return result;
    }
}
//# sourceMappingURL=NavRequest.js.map