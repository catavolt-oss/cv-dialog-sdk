/**
 * Created by rburson on 3/6/15.
 */

module catavolt.util {

    export class ArrayUtil{

        static copy<T>(source:Array<T>): Array<T> {
            return source.map((e:T)=>{return e});
        }
    }
}