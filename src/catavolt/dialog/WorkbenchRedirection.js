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
        var WorkbenchRedirection = (function (_super) {
            __extends(WorkbenchRedirection, _super);
            function WorkbenchRedirection(_workbenchId, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._workbenchId = _workbenchId;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(WorkbenchRedirection.prototype, "workbenchId", {
                get: function () {
                    return this._workbenchId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "dialogProperties", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                set: function (props) {
                    this._fromDialogProperties = props;
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchRedirection;
        })(dialog.Redirection);
        dialog.WorkbenchRedirection = WorkbenchRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
