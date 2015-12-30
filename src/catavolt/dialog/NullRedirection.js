/**
 * Created by rburson on 3/17/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Redirection_1 = require("./Redirection");
var NullRedirection = (function (_super) {
    __extends(NullRedirection, _super);
    function NullRedirection(fromDialogProperties) {
        _super.call(this);
        this.fromDialogProperties = fromDialogProperties;
    }
    return NullRedirection;
})(Redirection_1.Redirection);
exports.NullRedirection = NullRedirection;
