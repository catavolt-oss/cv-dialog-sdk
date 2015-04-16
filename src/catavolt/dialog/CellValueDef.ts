/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>
/*
    @TODO
 */

module catavolt.dialog {

    export class CellValueDef {

        static fromWS(otype:string, jsonObj):Try<CellValueDef> {
        }

        constructor(private _style:string) {
        }

        get isInlineMediaStyle():boolean {
            return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
        }

        get style():string {
            return this._style;
        }

    }
}