/// <reference types="random-js" />
import { Tree } from './Tree';
import * as Random from 'random-js';
export interface GenEnv {
    readonly rng: Random;
    readonly size: number;
}
export declare class Gen<A> {
    readonly gen: (env: GenEnv) => Tree<A>;
    constructor(gen: (env: GenEnv) => Tree<A>);
    static of<A>(a: A): Gen<A>;
    map<B>(f: (a: A) => B): Gen<B>;
    chain<B>(f: (a: A) => Gen<B>): Gen<B>;
    withTree<B>(f: (ta: Tree<A>) => Tree<B>): Gen<B>;
    sample(size?: number, seed?: number): A;
    sampleWithShrinks(size?: number, seed?: number): Tree<A>;
    wrap<K extends string>(k: K): Gen<Record<K, A>>;
    pair<B>(b: Gen<B>): Gen<[A, B]>;
    replicate(n: number): Gen<A[]>;
    pojo(keygen?: Gen<string>): Gen<Record<string, A>>;
    array(): Gen<A[]>;
    nearray(): Gen<A[]>;
    small(): Gen<A>;
    big(): Gen<A>;
    huge(): Gen<A>;
    pow(exponent: number): Gen<A>;
    one(): Gen<[A]>;
    two(): Gen<[A, A]>;
    three(): Gen<[A, A, A]>;
    four(): Gen<[A, A, A, A]>;
}
export declare function resize<A>(op: (size: number) => number, g: Gen<A>): Gen<A>;
export declare function record<T extends Record<string, any>>(r: {
    [K in keyof T]: Gen<T[K]>;
}): Gen<T>;
export declare function sequence<A>(gs: Gen<A>[]): Gen<A[]>;
export declare function choose<A>(xs: A[]): Gen<A>;
export declare function oneof<A>(gs: Gen<A>[]): Gen<A>;
export declare function frequency<A>(table: [number, Gen<A>][]): Gen<A>;
export declare function lazyFrequency<A>(table: [number, () => Gen<A>][]): Gen<A>;
/** The constant generator: always generates the supplied value */
export declare function of<A>(a: A): Gen<A>;
export declare function pair<A, B>(ga: Gen<A>, gb: Gen<B>): Gen<[A, B]>;
export declare function replicate<A>(n: number, g: Gen<A>): Gen<A[]>;
export declare function pojo<A>(v: Gen<A>, k?: Gen<string>): Gen<Record<string, A>>;
export declare function array<A>(g: Gen<A>): Gen<A[]>;
export declare function nearray<A>(g: Gen<A>): Gen<A[]>;
export declare function small<A>(g: Gen<A>): Gen<A>;
export declare function big<A>(g: Gen<A>): Gen<A>;
export declare function huge<A>(g: Gen<A>): Gen<A>;
export declare function pow<A>(exponent: number, g: Gen<A>): Gen<A>;
export declare function one<A>(g: Gen<A>): Gen<[A]>;
export declare function two<A>(g: Gen<A>): Gen<[A, A]>;
export declare function three<A>(g: Gen<A>): Gen<[A, A, A]>;
export declare function four<A>(g: Gen<A>): Gen<[A, A, A, A]>;
/** max exclusive */
export declare function range(max: number): Gen<number>;
/** max exclusive */
export declare function floatRange(max?: number): Gen<number>;
/** hi inclusive */
export declare function between(lo: number, hi: number): Gen<number>;
/** hi exclusive */
export declare function floatBetween(lo: number, hi: number): Gen<number>;
/** Generate a binary number (0 or 1) */
export declare const bin: Gen<0 | 1>;
/** Generate a small natural number */
export declare const nat: Gen<number>;
/** Generate a small integer */
export declare const int: Gen<number>;
/** Generate a small positive number */
export declare const pos: Gen<number>;
/** Generate a small negative number */
export declare const neg: Gen<number>;
/** Generate a nonnegative i32 */
export declare const natural: Gen<number>;
/** Generate any i32 */
export declare const integer: Gen<number>;
/** Generate a positive i32 */
export declare const positive: Gen<number>;
/** Generate a negative i32 */
export declare const negative: Gen<number>;
export declare const bool: Gen<boolean>;
export declare function string(g: Gen<string>, sep?: string): Gen<string>;
export declare function nestring(g: Gen<string>, sep?: string): Gen<string>;
export declare type GenChar = Gen<string> & {
    string(sep?: string): Gen<string>;
    nestring(sep?: string): Gen<string>;
};
export declare function blessGenChar(g: Gen<string>): GenChar;
/** hi inclusive */
export declare function charRange(lo: string, hi: string): GenChar;
export declare function char(chars: string): GenChar;
export declare const digit: GenChar;
export declare const lower: GenChar;
export declare const upper: GenChar;
export declare const alpha: GenChar;
export declare const alphanum: GenChar;
export declare const ascii: GenChar;
export declare const whitespace: GenChar;
export declare function concat(gs: Gen<string>[], sep?: string): Gen<string>;
/** Permute using Fisher-Yates shuffle */
export declare function permute<A>(xs: A[]): Gen<A[]>;
export declare function rec<A>(g: (tie: (size?: number) => Gen<A>, size: number) => Gen<A>): Gen<A>;
export declare function letrec<R extends Record<string, any>>(generators: {
    [K in keyof R]: (tie: {
        [K in keyof R]: (size?: number) => Gen<R[K]>;
    }, size: number) => Gen<R[K]>;
}): {
    [K in keyof R]: Gen<R[K]>;
};
