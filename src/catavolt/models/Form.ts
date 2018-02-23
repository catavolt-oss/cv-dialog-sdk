import {View} from "./View";

/**
 * A composition of View objects that, together, comprise a UI form.
 */
export class Form extends View {

    public readonly borderStyle: string;
    public readonly formStyle: string;
    public readonly formLayout: string;

    get isCompositeForm(): boolean {
        return this.formStyle === "COMPOSITE_FORM";
    }

    get isFlowingLayout(): boolean {
        return this.formLayout && this.formLayout === "FLOWING";
    }

    get isFlowingTopDownLayout(): boolean {
        return this.formLayout && this.formLayout === "FLOWING_TOP_DOWN";
    }

    get isFourBoxSquareLayout(): boolean {
        return (this.formLayout && this.formLayout === "FOUR_BOX_SQUARE") ||
            (this.formLayout && this.formLayout === "H(2,2)");
    }

    get isHorizontalLayout(): boolean {
        return this.formLayout && this.formLayout === "H";
    }

    get isOptionsFormLayout(): boolean {
        return this.formLayout && this.formLayout === "OPTIONS_FORM";
    }

    get isTabsLayout(): boolean {
        return this.formLayout && this.formLayout === "TABS";
    }

    get isThreeBoxOneLeftLayout(): boolean {
        return this.formLayout && this.formLayout === "THREE_ONE_LEFT";
    }

    get isThreeBoxOneOverLayout(): boolean {
        return this.formLayout && this.formLayout === "THREE_ONE_OVER";
    }

    get isThreeBoxOneRightLayout(): boolean {
        return this.formLayout && this.formLayout === "THREE_ONE_RIGHT";
    }

    get isThreeBoxOneUnderLayout(): boolean {
        return this.formLayout && this.formLayout === "THREE_ONE_UNDER";
    }

    get isTopDownLayout(): boolean {
        return this.formLayout && this.formLayout === "TOP_DOWN";
    }

    get isTwoVerticalLayout(): boolean {
        return this.formLayout && this.formLayout.indexOf("H(2,V") > -1;
    }

}
