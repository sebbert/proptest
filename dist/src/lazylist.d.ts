export declare type Thunk<A> = {
    expr: (() => A) | undefined;
    memorized: A | undefined;
};
export declare function force<A>(thunk: Thunk<A>): A;
/**
 * A lazy list is a thunk that is either a pair of a value an a tail or the
 * empty list (represented as undefined)
 */
export declare type LazyList<A> = Thunk<Cons<A> | undefined>;
export interface Cons<A> {
    head: A;
    tail: LazyList<A>;
}
export declare const nil: Thunk<undefined>;
export declare function cons<A>(head: A, tail: LazyList<A>): Thunk<{
    head: A;
    tail: Thunk<Cons<A> | undefined>;
}>;
export declare function map<A, B>(f: (a: A) => B, l: LazyList<A>): LazyList<B>;
export declare function concat<A>(l1: LazyList<A>, l2: LazyList<A>): LazyList<A>;
export declare function flatten<A>(ls: LazyList<LazyList<A>>): LazyList<A>;
export declare function iterate<A>(init: A, loop: (a: A) => A): LazyList<A>;
export declare function takeWhile<A>(p: (a: A) => boolean, ls: LazyList<A>): LazyList<A>;
export declare function fromArray<A>(arr: A[]): LazyList<A>;
export declare function toArray<A>(l: LazyList<A>): A[];
