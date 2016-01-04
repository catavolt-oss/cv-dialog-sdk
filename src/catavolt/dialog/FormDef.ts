/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class FormDef extends PaneDef {

        static fromOpenFormResult(formXOpenResult:XOpenEditorModelResult,
                                  formXFormDef:XFormDef,
                                  formMenuDefs:Array<MenuDef>,
                                  childrenXOpens:Array<XOpenDialogModelResult>,
                                  childrenXPaneDefs:Array<XPaneDef>,
                                  childrenXActiveColDefs:Array<XGetActiveColumnDefsResult>,
                                  childrenMenuDefs:Array<Array<MenuDef>>):Try<FormDef> {

            var settings:StringDictionary = {'open': true};
            ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
            var headerDef:DetailsDef = null;
            var childrenDefs:Array<PaneDef> = [];
            for(var i = 0; i < childrenXOpens.length; i++) {
                var childXOpen = childrenXOpens[i];
                var childXPaneDef = childrenXPaneDefs[i];
                var childXActiveColDefs = childrenXActiveColDefs[i];
                var childMenuDefs = childrenMenuDefs[i];
                var childXComp = formXOpenResult.formModel.children[i];
                var childXPaneDefRef = formXFormDef.paneDefRefs[i];
                var paneDefTry = PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef,
                    childXActiveColDefs, childMenuDefs);
                if (paneDefTry.isFailure) {
                    return new Failure<FormDef>(paneDefTry.failure);
                } else {
                    childrenDefs.push(paneDefTry.success);
                }
            }

            return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label,
                formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection,
                settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));

        }

        constructor(paneId:string,
                    name:string,
                    label:string,
                    title:string,
                    menuDefs:Array<MenuDef>,
                    entityRecDef:EntityRecDef,
                    dialogRedirection:DialogRedirection,
                    settings:StringDictionary,
                    private _formLayout:string,
                    private _formStyle:string,
                    private _borderStyle:string,
                    private _headerDef:DetailsDef,
                    private _childrenDefs:Array<PaneDef>){

            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

        }

        get borderStyle():string {
            return this._borderStyle;
        }

        get childrenDefs():Array<PaneDef> {
            return this._childrenDefs;
        }

        get formLayout():string {
            return this._formLayout;
        }

        get formStyle():string {
            return this._formStyle;
        }

        get headerDef():DetailsDef {
            return this._headerDef;
        }

        get isFlowingLayout():boolean{
            return this.formLayout && this.formLayout === 'FLOWING';
        }

        get isFlowingTopDownLayout():boolean{
            return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
        }

        get isFourBoxSquareLayout():boolean{
            return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
        }

        get isHorizontalLayout():boolean{
            return this.formLayout && this.formLayout === 'H';
        }

        get isOptionsFormLayout():boolean{
            return this.formLayout && this.formLayout === 'OPTIONS_FORM';
        }

        get isTabsLayout():boolean{
            return this.formLayout && this.formLayout === 'TABS';
        }

        get isThreeBoxOneLeftLayout():boolean{
            return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
        }

        get isThreeBoxOneOverLayout():boolean{
            return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
        }

        get isThreeBoxOneRightLayout():boolean{
            return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
        }

        get isThreeBoxOneUnderLayout():boolean{
            return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
        }

        get isTopDownLayout():boolean{
            return this.formLayout && this.formLayout === 'TOP_DOWN';
        }

        get isTwoVerticalLayout():boolean{
            return this.formLayout && this.formLayout === 'H(2,V)';
        }
    }
}
