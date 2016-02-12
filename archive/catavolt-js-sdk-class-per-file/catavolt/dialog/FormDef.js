/**
 * Created by rburson on 3/30/15.
 */
import { PaneDef } from "./PaneDef";
import { ObjUtil } from "../util/ObjUtil";
import { Failure } from "../fp/Failure";
import { Success } from "../fp/Success";
export class FormDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._formLayout = _formLayout;
        this._formStyle = _formStyle;
        this._borderStyle = _borderStyle;
        this._headerDef = _headerDef;
        this._childrenDefs = _childrenDefs;
    }
    static fromOpenFormResult(formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
        var settings = { 'open': true };
        ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
        var headerDef = null;
        var childrenDefs = [];
        for (var i = 0; i < childrenXOpens.length; i++) {
            var childXOpen = childrenXOpens[i];
            var childXPaneDef = childrenXPaneDefs[i];
            var childXActiveColDefs = childrenXActiveColDefs[i];
            var childMenuDefs = childrenMenuDefs[i];
            var childXComp = formXOpenResult.formModel.children[i];
            var childXPaneDefRef = formXFormDef.paneDefRefs[i];
            var paneDefTry = PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
            if (paneDefTry.isFailure) {
                return new Failure(paneDefTry.failure);
            }
            else {
                childrenDefs.push(paneDefTry.success);
            }
        }
        return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
    }
    get borderStyle() {
        return this._borderStyle;
    }
    get childrenDefs() {
        return this._childrenDefs;
    }
    get formLayout() {
        return this._formLayout;
    }
    get formStyle() {
        return this._formStyle;
    }
    get headerDef() {
        return this._headerDef;
    }
    get isFlowingLayout() {
        return this.formLayout && this.formLayout === 'FLOWING';
    }
    get isFlowingTopDownLayout() {
        return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
    }
    get isFourBoxSquareLayout() {
        return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
    }
    get isHorizontalLayout() {
        return this.formLayout && this.formLayout === 'H';
    }
    get isOptionsFormLayout() {
        return this.formLayout && this.formLayout === 'OPTIONS_FORM';
    }
    get isTabsLayout() {
        return this.formLayout && this.formLayout === 'TABS';
    }
    get isThreeBoxOneLeftLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
    }
    get isThreeBoxOneOverLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
    }
    get isThreeBoxOneRightLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
    }
    get isThreeBoxOneUnderLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
    }
    get isTopDownLayout() {
        return this.formLayout && this.formLayout === 'TOP_DOWN';
    }
    get isTwoVerticalLayout() {
        return this.formLayout && this.formLayout === 'H(2,V)';
    }
}
//# sourceMappingURL=FormDef.js.map