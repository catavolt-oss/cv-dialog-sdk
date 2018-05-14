import {AnnotationVisitor} from "./AnnotationVisitor";
import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class PropertyVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('PropertyVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isPropertyModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to PropertyVisitor is not a Property");
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

    public * visitAnnotations(): IterableIterator<AnnotationVisitor> {
        let index = 0;
        while (index < this.enclosedJsonObject().annotations.length) {
            yield new AnnotationVisitor(this.enclosedJsonObject().annotations[index++]);
        }
    }

    public format(): string {
        return this.enclosedJsonObject().format;
    }

    public name(): string {
        return this.enclosedJsonObject().name;
    }

    public type(): string {
        return this.enclosedJsonObject().type;
    }

    public value(): string {
        return this.enclosedJsonObject().value;
    }

}
