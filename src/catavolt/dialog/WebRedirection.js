/**
 * Created by rburson on 3/27/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WebRedirection = (function (_super) {
            __extends(WebRedirection, _super);
            function WebRedirection(_webURL, _open, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._webURL = _webURL;
                this._open = _open;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(WebRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                set: function (props) {
                    this._fromDialogProperties = props;
                },
                enumerable: true,
                configurable: true
            });
            return WebRedirection;
        })(dialog.Redirection);
        dialog.WebRedirection = WebRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
