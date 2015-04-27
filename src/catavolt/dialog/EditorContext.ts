/**
 * Created by rburson on 4/27/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    enum EditorState{ READ, WRITE, DESTROYED };

    export class EditorContext extends PaneContext {

        private static GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
        private static GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';

        private _buffer:EntityBuffer;
        private _editorState:EditorState;
        private _entityRecDef:EntityRecDef;
        private _settings:StringDictionary;

        constructor(paneRef:number) {
            super(paneRef);
        }

    }
}