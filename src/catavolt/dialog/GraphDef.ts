/**
 * Created by rburson on 4/22/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class GraphDef extends PaneDef{

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
    }
}