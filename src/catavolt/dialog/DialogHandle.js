/**
 * Created by rburson on 3/27/15.
 */
var DialogHandle = (function () {
    function DialogHandle(handleValue, sessionHandle) {
        this.handleValue = handleValue;
        this.sessionHandle = sessionHandle;
    }
    return DialogHandle;
})();
exports.DialogHandle = DialogHandle;
