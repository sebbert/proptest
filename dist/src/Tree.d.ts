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
    /** distribute fairly */
    static dist<T extends Record<string, any>>(trees: {
        [K in keyof T]: Tree<T[K]>;
    }): Tree<T>;
    /** distribute array fairly */
    static dist_array<A>(trees: Tree<A>[]): Tree<A[]>;
    /** debugging function to view the tree evaluated */
    force(depth?: number): StrictTree<A>;
    /** returns the last but leftmost subtree without any backtracking
     where the property is true */
    left_first_search<B>(p: (a: A) => B | undefined, fuel?: number): {
        match: B;
        fuel: number;
    } | undefined;
    left_first_search_async<B>(p: (a: A) => Promise<B | undefined>, fuel?: number): Promise<{
        match: B;
        fuel: number;
    } | undefined>;
}
/** Searches from the children of the tree */
export declare function dfs<A, B>(b: B, p: (a: A) => B | undefined, tree: Tree<A>, fuel: number): {
    match: B;
    fuel: number;
};
/** Searches from the children of the tree */
export declare function dfsAsync<A, B>(b: B, p: (a: A) => Promise<B | undefined>, tree: Tree<A>, fuel: number): Promise<{
    match: B;
    fuel: number;
}>;
export declare function shrinkNumber(n: number, towards?: number): Tree<number>;
