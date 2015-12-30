/**
 * Created by rburson on 4/22/15.
 */

import {PaneDef} from "./PaneDef";
import {MenuDef} from "./MenuDef";
import {EntityRecDef} from "./EntityRecDef";
import {DialogRedirection} from "./DialogRedirection";
import {StringDictionary} from "../util/Types";
import {GraphDataPointDef} from "./GraphDataPointDef";

export class GraphDef extends PaneDef {

    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _graphType:string,
                private _identityDataPointDef:GraphDataPointDef,
                private _groupingDataPointDef:GraphDataPointDef,
                private _dataPointDefs:Array<GraphDataPointDef>,
                private _filterDataPointDefs:Array<GraphDataPointDef>,
                private _sampleModel:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get dataPointDefs():Array<GraphDataPointDef> {
        return this._dataPointDefs;
    }

    get filterDataPointDefs():Array<GraphDataPointDef> {
        return this._filterDataPointDefs;
    }

    get identityDataPointDef():GraphDataPointDef {
        return this._identityDataPointDef;
    }

    get groupingDataPointDef():GraphDataPointDef {
        return this._groupingDataPointDef;
    }

    get sampleModel():string {
        return this._sampleModel;
    }
}
