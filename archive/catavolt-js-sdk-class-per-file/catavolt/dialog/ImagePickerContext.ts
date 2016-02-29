/**
 * Created by rburson on 5/4/15.
 */

import {QueryContext} from "./QueryContext";
import {ImagePickerDef} from "./ImagePickerDef";

export class ImagePickerContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get imagePickerDef():ImagePickerDef {
        return <ImagePickerDef>this.paneDef;
    }

}
