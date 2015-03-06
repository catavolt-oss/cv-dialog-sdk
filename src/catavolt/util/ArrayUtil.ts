/**
 * Created by rburson on 3/6/15.
 */

module catavolt.util {

    export class ArrayUtil{

        static deepCopy<T>(source:Array<T>): Array<T> {
            var target:Array<T> = new Array();
            source.forEach(
                (item:T)=>{ target.push(item); }
            );
            return target;
        }
    }
}