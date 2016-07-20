/**
 * Created by rburson on 3/16/15.
 */
export declare class Try<A> {
    static flatten<A>(tryList: Array<Try<A>>): Try<Array<A>>;
    private static isListOfTry(list);
    bind<B>(f: TryFn<A, B>): Try<B>;
    failure: any;
    isFailure: boolean;
    isSuccess: boolean;
    map<B>(f: MapFn<A, B>): Try<B>;
    success: A;
}
export declare class Failure<A> extends Try<A> {
    private _error;
    constructor(_error: any);
    failure: any;
    isFailure: boolean;
}
export declare class Success<A> extends Try<A> {
    private _value;
    constructor(_value: A);
    isSuccess: boolean;
    success: A;
}
/**
 * Created by rburson on 3/5/15.
 */
export declare class Either<A, B> {
    private _left;
    private _right;
    static left<A, B>(left: A): Either<A, B>;
    static right<A, B>(right: B): Either<A, B>;
    isLeft: boolean;
    isRight: boolean;
    left: A;
    right: B;
}
export declare class Future<A> {
    private _label;
    /** --------------------- PUBLIC STATIC ------------------------------*/
    static createCompletedFuture<A>(label: string, result: Try<A>): Future<A>;
    static createSuccessfulFuture<A>(label: string, value: A): Future<A>;
    static createFailedFuture<A>(label: string, error: any): Future<A>;
    static createFuture<A>(label: string): Future<A>;
    static sequence<A>(seqOfFutures: Array<Future<A>>): Future<Array<Try<A>>>;
    private _completionListeners;
    private _result;
    /** --------------------- CONSTRUCTORS ------------------------------*/
    constructor(_label: any);
    /** --------------------- PUBLIC ------------------------------*/
    bind<B>(f: FutureFn<A, B>): Future<B>;
    failure: any;
    isComplete: boolean;
    isCompleteWithFailure: boolean;
    isCompleteWithSuccess: boolean;
    map<B>(f: MapFn<A, B>): Future<B>;
    onComplete(listener: CompletionListener<A>): void;
    onFailure(listener: FailureListener): void;
    onSuccess(listener: SuccessListener<A>): void;
    result: Try<A>;
    success: A;
    /** --------------------- MODULE ------------------------------*/
    complete(t: Try<A>): Future<A>;
}
/**
 * Created by rburson on 3/6/15.
 */
export declare class Promise<A> {
    private _future;
    constructor(label: string);
    /** --------------------- PUBLIC ------------------------------*/
    isComplete(): boolean;
    complete(t: Try<A>): Promise<A>;
    failure(error: any): void;
    future: Future<A>;
    success(value: A): void;
}
/**
 * Created by rburson on 3/9/15.
 */
export interface TryClosure<A> {
    (): Try<A>;
}
export interface TryFn<A, B> {
    (value: A): Try<B>;
}
export interface CompletionListener<A> {
    (t: Try<A>): void;
}
export interface FailureListener {
    (failure: any): void;
}
export interface FutureFn<A, B> {
    (value: A): Future<B>;
}
export interface MapFn<A, B> {
    (value: A): B;
}
export interface SuccessListener<A> {
    (success: A): void;
}
