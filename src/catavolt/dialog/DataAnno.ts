/**
 * Created by rburson on 4/2/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class DataAnno {

        private static BOLD_TEXT          = "BOLD_TEXT";
        private static BACKGROUND_COLOR   = "BGND_COLOR";
        private static FOREGROUND_COLOR   = "FGND_COLOR";
        private static IMAGE_NAME         = "IMAGE_NAME";
        private static IMAGE_PLACEMENT    = "IMAGE_PLACEMENT";
        private static ITALIC_TEXT        = "ITALIC_TEXT";
        private static OVERRIDE_TEXT      = "OVRD_TEXT";
        private static TIP_TEXT           = "TIP_TEXT";
        private static UNDERLINE          = "UNDERLINE";
        private static TRUE_VALUE          = "1";
        private static PLACEMENT_CENTER         = "CENTER";
        private static PLACEMENT_LEFT           = "LEFT";
        private static PLACEMENT_RIGHT          = "RIGHT";
        private static PLACEMENT_UNDER          = "UNDER";
        private static PLACEMENT_STRETCH_UNDER  = "STRETCH_UNDER";

        static annotatePropsUsingWSDataAnnotation(props:Array<Prop>, jsonObj:StringDictionary):Try<Array<Prop>> {
            return DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', OType.factoryFn).bind(
                (propAnnos:Array<Array<DataAnno>>) => {
                    var annotatedProps:Array<Prop> = [];
                    for(var i=0; i < props.length; i++) {
                        var p = props[i];
                        var annos:Array<DataAnno> = propAnnos[i];
                        if(annos) {
                            annotatedProps.push(new Prop(p.name, p.value, annos));
                        } else {
                            annotatedProps.push(p);
                        }
                    }
                    return new Success(annotatedProps);
                }
            );
        }

        static backgroundColor(annos:Array<DataAnno>):string {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
              return anno.isBackgroundColor;
            });
            return result ? result.backgroundColor : null;
        }

        static foregroundColor(annos:Array<DataAnno>):string {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
                return anno.isForegroundColor;
            });
            return result ? result.foregroundColor : null;
        }

        static imageName(annos:Array<DataAnno>):string {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
                return anno.isImageName;
            });
            return result ? result.value : null;
        }

        static imagePlacement(annos:Array<DataAnno>):string {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
                return anno.isImagePlacement;
            });
            return result ? result.value : null;
        }

        static isBoldText(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isBoldText });
        }

        static isItalicText(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isItalicText });
        }

        static isPlacementCenter(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isPlacementCenter });
        }

        static isPlacementLeft(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isPlacementLeft });
        }

        static isPlacementRight(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isPlacementRight });
        }

        static isPlacementStretchUnder(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isPlacementStretchUnder });
        }

        static isPlacementUnder(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isPlacementUnder });
        }

        static isUnderlineText(annos:Array<DataAnno>):boolean {
            return annos.some((anno)=>{ return anno.isUnderlineText });
        }

        static overrideText(annos:Array<DataAnno>):string  {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
                return anno.isOverrideText;
            });
            return result ? result.value : null;
        }

        static tipText(annos:Array<DataAnno>):string {
            var result:DataAnno = ArrayUtil.find(annos, (anno)=>{
                return anno.isTipText;
            });
            return result ? result.value : null;
        }

        static fromWS(otype:string, jsonObj):Try<Array<DataAnno>> {
           var stringObj = jsonObj['annotations'];
            if(stringObj['WS_LTYPE'] !== 'String') {
                return new Failure<Array<DataAnno>>('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
            }
            var annoStrings:Array<string> = stringObj['values'];
            var annos:Array<DataAnno> = [];
            for(var i = 0; i < annoStrings.length; i++) {
               annos.push(DataAnno.parseString(annoStrings[i]));
            }
            return new Success<Array<DataAnno>>(annos);
        }

        private static parseString(formatted:string):DataAnno {
            var pair = StringUtil.splitSimpleKeyValuePair(formatted);
            return new DataAnno(pair[0], pair[1]);
        }


        constructor(private _name:string, private _value:string) {
        }

        get backgroundColor():string {
           return this.isBackgroundColor ? this.value : null;
        }

        get foregroundColor():string {
            return this.isForegroundColor ? this.value : null;
        }

        equals(dataAnno:DataAnno):boolean {
            return this.name === dataAnno.name;
        }

        get isBackgroundColor():boolean {
            return this.name === DataAnno.BACKGROUND_COLOR;
        }

        get isBoldText():boolean {
            return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
        }

        get isForegroundColor():boolean {
            return this.name === DataAnno.FOREGROUND_COLOR;
        }

        get isImageName():boolean {
            return this.name === DataAnno.IMAGE_NAME;
        }

        get isImagePlacement():boolean {
            return this.name === DataAnno.IMAGE_PLACEMENT;
         }

        get isItalicText():boolean {
            return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
        }

        get isOverrideText():boolean  {
            return this.name === DataAnno.OVERRIDE_TEXT;
        }

        get isPlacementCenter():boolean {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
        }

        get isPlacementLeft():boolean {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
        }

        get isPlacementRight():boolean {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
        }

        get isPlacementStretchUnder():boolean {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
        }

        get isPlacementUnder():boolean {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
        }

        get isTipText():boolean {
            return this.name === DataAnno.TIP_TEXT;
        }

        get isUnderlineText():boolean {
            return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
        }

        get name():string {
            return this._name;
        }

        get value():string {
            return this._value;
        }

    }
}