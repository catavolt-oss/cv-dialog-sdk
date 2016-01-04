/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModel = (function () {
            function XFormModel(form, header, children, placement, refreshTimer, sizeToWindow) {
                this.form = form;
                this.header = header;
                this.children = children;
                this.placement = placement;
                this.refreshTimer = refreshTimer;
                this.sizeToWindow = sizeToWindow;
            }
            /*
                This custom fromWS method is necessary because the XFormModelComps, must be
                built with the 'ignoreRedirection' flag set to true
             */
            XFormModel.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', dialog.OType.factoryFn, true).bind(function (form) {
                    var header = null;
                    if (jsonObj['header']) {
                        var headerTry = dialog.DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', dialog.OType.factoryFn, true);
                        if (headerTry.isFailure)
                            return new Failure(headerTry.isFailure);
                        header = headerTry.success;
                    }
                    return dialog.DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', dialog.OType.factoryFn, true).bind(function (children) {
                        return new Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
                    });
                });
            };
            return XFormModel;
        })();
        dialog.XFormModel = XFormModel;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
