/**
 * Created by rburson on 3/16/15.
 */

module catavolt.fp {

    export class Either<A,B> {

        private _left:A;
        private _right:B;

        static left<A,B>(left:A):Either<A,B> {
            var either = new Either<A,B>();
            either._left = left;
            return either;
        }

        static right<A,B>(right:B):Either<A,B> {
            var either = new Either<A,B>();
            either._right = right;
            return either;
        }

        get isLeft():boolean {
            return !!this._left;
        }

        get isRight():boolean {
            return !!this._right;
        }

        get left():A {
            return this._left;
        }

        get right():B {
            return this._right;
        }

    }
}
