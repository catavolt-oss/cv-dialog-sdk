/**
 * Created by rburson on 3/30/15.
 */
var XPaneDefRef = (function () {
    function XPaneDefRef(name, paneId, title, type) {
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.type = type;
    }
    return XPaneDefRef;
})();
exports.XPaneDefRef = XPaneDefRef;
