/**
 * Created by rburson on 3/17/15.
 */
var ObjUtil_1 = require("../util/ObjUtil");
var Future_1 = require("../fp/Future");
var WebRedirection_1 = require("./WebRedirection");
var WorkbenchRedirection_1 = require("./WorkbenchRedirection");
var AppContext_1 = require("./AppContext");
var DialogRedirection_1 = require("./DialogRedirection");
var FormContextBuilder_1 = require("./FormContextBuilder");
var NullRedirection_1 = require("./NullRedirection");
var NullNavRequest_1 = require("./NullNavRequest");
var NavRequestUtil = (function () {
    function NavRequestUtil() {
    }
    NavRequestUtil.fromRedirection = function (redirection, actionSource, sessionContext) {
        var result;
        if (redirection instanceof WebRedirection_1.WebRedirection) {
            result = Future_1.Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        }
        else if (redirection instanceof WorkbenchRedirection_1.WorkbenchRedirection) {
            var wbr = redirection;
            result = AppContext_1.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                return wb;
            });
        }
        else if (redirection instanceof DialogRedirection_1.DialogRedirection) {
            var dr = redirection;
            var fcb = new FormContextBuilder_1.FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        }
        else if (redirection instanceof NullRedirection_1.NullRedirection) {
            var nullRedir = redirection;
            var nullNavRequest = new NullNavRequest_1.NullNavRequest();
            ObjUtil_1.ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
            result = Future_1.Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        }
        else {
            result = Future_1.Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil_1.ObjUtil.formatRecAttr(redirection));
        }
        return result;
    };
    return NavRequestUtil;
})();
exports.NavRequestUtil = NavRequestUtil;
