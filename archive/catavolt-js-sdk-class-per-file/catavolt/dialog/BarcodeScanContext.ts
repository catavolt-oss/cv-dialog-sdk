/**
 * Created by rburson on 5/4/15.
 */

import {EditorContext} from "./EditorContext";
import {BarcodeScanDef} from "./BarcodeScanDef";

export class BarcodeScanContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get barcodeScanDef():BarcodeScanDef {
        return <BarcodeScanDef>this.paneDef;
    }

}
