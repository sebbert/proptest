import * as P from './Property';
import { Property, Options, search, searchAndThen } from './Property';
export { Property, Options, search, searchAndThen };
import { Gen } from './Gen';
export { Gen };
export * from './Gen';
export declare const expectFailure: Partial<Options>;
export declare const randomSeed: Partial<Options>;
export declare const seed: (seed: number) => Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}>;
export declare const tests: (tests: number) => Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}>;
export declare const maxShrinks: (maxShrinks: number) => Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}>;
/** Searches for a counterexample and prints it on stdout if it is found.

Returns whether a counterexample was found.

TODO: Remove in favour of forallStrings? */
export declare const stdoutForall: <A>(g: Gen<A>, prop: (a: A, p: P.Property) => boolean, options?: Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}> | undefined) => boolean;
/** Searches for a counterexample and throws an error if one is found */
export declare const assertForall: <A>(g: Gen<A>, prop: (a: A, p: P.Property) => boolean, options?: Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}> | undefined) => void;
/** Searches for a counterexample and returns the result formatted as an array of strings */
export declare const forallStrings: <A>(g: Gen<A>, prop: (a: A, p: P.Property) => boolean, options?: Partial<{
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
}> | undefined) => {
    ok: boolean;
    messages: string[];
};
export interface TestCreator<R> {
    (description: string, callback: () => void): R;
    only(description: string, callback: () => void): R;
    skip(description: string, callback: () => void): void;
}
export declare type TestFunction<P, R> = <A>(description: string, g: Gen<A>, prop: (a: A, p: Property) => P, options?: Partial<Options>) => R;
export declare type PropertyCreator<P, R> = TestFunction<P, R> & {
    only: TestFunction<P, R>;
    skip: TestFunction<P, void>;
};
export declare function createProperty<R>(test: TestCreator<R>): PropertyCreator<boolean, R>;
export interface TapeTest {
    pass(msg: string): void;
    fail(msg: string): void;
    comment(msg: string): void;
    end(): void;
}
/** Adapt tape using forallStrings */
export declare function adaptTape(test: (name: string, cb: (t: TapeTest) => void) => void): PropertyCreator<boolean, void>;
