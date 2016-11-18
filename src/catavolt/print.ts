/**
 * Created by rburson on 3/27/15.
 */
import {
    StringDictionary,
    TimeValue,
    DateValue,
    DateTimeValue,
    Log,
    ObjUtil,
    StringUtil,
    ArrayUtil,
    DataUrl
} from "./util";
import {Try, Either, Future, Success, Failure, TryClosure, MapFn} from "./fp";
import {SessionContext, SystemContext, Call, Get} from "./ws";
import * as moment from 'moment';

/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */

/**
 * *********************************
 */
export class Spec {
    constructor(protected def:XMLDocument) {
    }
}

/**
 * *********************************
 */
export class Component extends Spec {
    // public backgroundColor:Color;
    // public binding:Binding;
    // public id:String;
    // public layout:Layout;
    // public padding:Edges;

    // PRIVATE MUTABLE FIELDS
    private _actualHeights:Array<number>;
    private _actualWidths:Array<number>;
    private _actualX:number;
    private actualY:number;
    private _height:number;
    // private _parent:Container;
    private _width:number;
    private _x:number;
    private _y:number;
    constructor(protected def:XMLDocument) {
        super(def);
    }



}

/**
 * *********************************
 */


/**
 * *********************************
 */
