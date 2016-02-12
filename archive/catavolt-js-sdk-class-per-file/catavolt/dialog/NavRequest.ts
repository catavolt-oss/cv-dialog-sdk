/**
 * Created by rburson on 3/17/15.
 */

import {ObjUtil} from "../util/ObjUtil";
import {Redirection} from "./Redirection";
import {ActionSource} from "./ActionSource";
import {SessionContext} from "../ws/SessionContext";
import {Future} from "../fp/Future";
import {WebRedirection} from "./WebRedirection";
import {WorkbenchRedirection} from "./WorkbenchRedirection";
import {AppContext} from "./AppContext";
import {Workbench} from "./Workbench";
import {DialogRedirection} from "./DialogRedirection";
import {FormContextBuilder} from "./FormContextBuilder";
import {NullRedirection} from "./NullRedirection";
import {NullNavRequest} from "./NullNavRequest";

export interface NavRequest {
}

export class NavRequestUtil {

    static fromRedirection(redirection:Redirection,
                           actionSource:ActionSource,
                           sessionContext:SessionContext):Future<NavRequest> {

        var result:Future<NavRequest>;
        if (redirection instanceof WebRedirection) {
            result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        } else if (redirection instanceof WorkbenchRedirection) {
            var wbr:WorkbenchRedirection = redirection;
            result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map((wb:Workbench)=> {
                return wb;
            });
        } else if (redirection instanceof DialogRedirection) {
            var dr:DialogRedirection = redirection;
            var fcb:FormContextBuilder = new FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        } else if (redirection instanceof NullRedirection) {
            var nullRedir:NullRedirection = redirection;
            var nullNavRequest:NullNavRequest = new NullNavRequest();
            ObjUtil.addAllProps(nullRedir.fromDialogProperties,
                nullNavRequest.fromDialogProperties);
            result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        } else {
            result = Future.createFailedFuture('NavRequest::fromRedirection',
                'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
        }
        return result;

    }

}
