import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class PropertyDefVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isPropertyDefModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to PropertyDefVisitor is not a PropertyDef");
        }
    }

    // --- State Management Helpers --- //

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

    public canCauseSideEffects(): boolean {
        return this.enclosedJsonObject().canCauseSideEffects;
    }

    public contentType(): string {
        return this.enclosedJsonObject().contentType;
    }

    public displayLength(): number {
        return this.enclosedJsonObject().displayLength;
    }

    public displayScale(): number {
        return this.enclosedJsonObject().displayScale;
    }

    public format(): string {
        return this.enclosedJsonObject().format;
    }

    public length(): number {
        return this.enclosedJsonObject().length;
    }

    public propertyName(): string {
        return this.enclosedJsonObject().propertyName;
    }

    public propertyType(): string {
        return this.enclosedJsonObject().propertyType;
    }

    public scale(): number {
        return this.enclosedJsonObject().scale;
    }

    public semanticType(): string {
        return this.enclosedJsonObject().semanticType;
    }

    public type(): string {
        return this.enclosedJsonObject().type;
    }

    public upperCaseOnly(): boolean {
        return this.enclosedJsonObject().upperCaseOnly;
    }

    public writeAllowed(): boolean {
        return this.enclosedJsonObject().writeAllowed;
    }

    public writeEnabled(): boolean {
        return this.enclosedJsonObject().writeEnabled;
    }

}
