import { LazyList } from './lazylist';
export interface StrictTree<A> {
    readonly top: A;
    readonly forest: StrictTree<A>[];
}
export declare class Tree<A> {
    readonly top: A;
    readonly forest: LazyList<Tree<A>>;
    constructor(top: A, forest: LazyList<Tree<A>>);
    static of<A>(a: A): Tree<A>;
    static tree<A>(top: A, forest: LazyList<Tree<A>>): Tree<A>;
    static tree$<A>(top: A, forest: Tree<A>[]): Tree<A>;
    map<B>(f: (a: A) => B): Tree<B>;
    chain<B>(f: (a: A) => Tree<B>): Tree<B>;
    left_first_pair<B>(tb: Tree<B>): Tree<[A, B]>;
    fair_pair<B>(tb: Tree<B>): Tree<[A, B]>;
    /** returns the last but leftmost subtree without any backtracking
     where the property is true */
    left_first_search(p: (a: A) => boolean, fuel?: number): {
        tree: Tree<A>;
        fuel: number;
    } | undefined;
    /** distribute fairly */
    static dist<T extends Record<string, any>>(trees: {
        [K in keyof T]: Tree<T[K]>;
    }): Tree<T>;
    /** distribute array fairly */
    static dist_array<A>(trees: Tree<A>[]): Tree<A[]>;
    /** debugging function to view the tree evaluated */
    force(depth?: number): StrictTree<A>;
}
export declare function shrinkNumber(n: number, towards?: number): Tree<number>;
/** Assumes that the property already holds for the top of the tree. */
export declare function dfs<A>(p: (a: A) => boolean, tree: Tree<A>, fuel: number): {
    tree: Tree<A>;
    fuel: number;
} | undefined;
