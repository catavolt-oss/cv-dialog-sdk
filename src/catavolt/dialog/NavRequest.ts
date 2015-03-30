/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export interface NavRequest {
    }

    export module NavRequest.Util {

        export function fromRedirection(redirection:Redirection,
                                        actionSource:ActionSource,
                                        sessionContext:SessionContext): Future<NavRequest>{

            var result:Future<NavRequest>;
            if(redirection instanceof WebRedirection) {
                result = Future.createFailedFuture('NavRequest::fromRedirection', 'WebRedirection not yet implemented');
            } else if (redirection instanceof WorkbenchRedirection){
                var wbr:WorkbenchRedirection = redirection;
                result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map((wb:Workbench)=>{
                    return wb;
                });
            } else if(redirection instanceof DialogRedirection) {
                var dr:DialogRedirection = redirection;
                /*var fcb:FormContextBuilder = new FormContextBuilder(dr, actionSource, sessionContext);
                result = fcb.build().map((formContext:FormContext)=>{
                    return formContext;
                });*/
            } else if(redirection instanceof NullRedirection) {
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

}
