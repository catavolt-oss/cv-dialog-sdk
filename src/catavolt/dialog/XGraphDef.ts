/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XGraphDef extends XPaneDef {

        constructor(public paneId:string,
                    public name:string,
                    public title:string,
                    public graphType:string,
                    public identityDataPoint:GraphDataPointDef,
                    public groupingDataPoint:GraphDataPointDef,
                    public dataPoints:Array<GraphDataPointDef>,
                    public filterDataPoints:Array<GraphDataPointDef>,
                    public sampleModel:string) {
            super();
        }

    }
}