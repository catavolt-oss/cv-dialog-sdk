/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NavRequest;
        (function (NavRequest) {
            var Util;
            (function (Util) {
                function fromRedirection(redirection, actionSource, sessionContext) {
                    var result;
                    if (redirection instanceof dialog.WebRedirection) {
                        result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
                    }
                    else if (redirection instanceof dialog.WorkbenchRedirection) {
                        var wbr = redirection;
                        result = dialog.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                            return wb;
                        });
                    }
                    else if (redirection instanceof dialog.DialogRedirection) {
                        var dr = redirection;
                        var fcb = new dialog.FormContextBuilder(dr, actionSource, sessionContext);
                        result = fcb.build();
                    }
                    else if (redirection instanceof dialog.NullRedirection) {
                        var nullRedir = redirection;
                        var nullNavRequest = new dialog.NullNavRequest();
                        ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
                        result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
                    }
                    else {
                        result = Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
                    }
                    return result;
                }
                Util.fromRedirection = fromRedirection;
            })(Util = NavRequest.Util || (NavRequest.Util = {}));
        })(NavRequest = dialog.NavRequest || (dialog.NavRequest = {}));
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
