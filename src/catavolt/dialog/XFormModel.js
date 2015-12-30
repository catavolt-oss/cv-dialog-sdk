/**
 * Created by rburson on 3/31/15.
 */
var DialogTriple_1 = require("./DialogTriple");
var OType_1 = require("./OType");
var Failure_1 = require("../fp/Failure");
var Success_1 = require("../fp/Success");
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
        return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', OType_1.OType.factoryFn, true).bind(function (form) {
            var header = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', OType_1.OType.factoryFn, true);
                if (headerTry.isFailure)
                    return new Failure_1.Failure(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple_1.DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', OType_1.OType.factoryFn, true).bind(function (children) {
                return new Success_1.Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });
    };
    return XFormModel;
})();
exports.XFormModel = XFormModel;
