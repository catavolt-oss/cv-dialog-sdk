import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class ActionParametersVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isActionParametersObject(this._enclosedJsonObject)) {
            throw new Error("Object passed to ActionParametersVisitor is not an ActionParameters");
        }
    }

    // --- State Management Helpers --- //

    public static visitTargetsValue(actionParameters: object): string[] {
        return (new ActionParametersVisitor(actionParameters)).visitTargetsValue();
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public visitTargetsValue(): string[] {
        return this._enclosedJsonObject.targets;
    }

}
