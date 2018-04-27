import { Gen } from './Gen';
export declare type TestDetails = {
    covers: Covers;
    log: any[][];
    tests: number;
};
export declare type CoverData = {
    req: number;
    hit: number;
    miss: number;
};
export declare type Covers = Record<string, CoverData>;
export declare function expand_cover_data(data: CoverData): {
    N: number;
    ratio: number;
    pct: number;
};
export declare type SearchResult<A> = TestDetails & ({
    ok: true;
    expectedFailure?: SearchResult<A>;
} | {
    ok: false;
    reason: 'counterexample';
    counterexample: A;
    shrinks: number;
} | {
    ok: false;
    reason: 'insufficient coverage';
    label: string;
} | ({
    ok: false;
    reason: 'exception';
    when: 'generating';
    exception: any;
}) | ({
    ok: false;
    reason: 'exception';
    when: 'evaluating';
    exception: any;
    counterexample: A;
    shrinks: number;
}) | {
    ok: false;
    reason: 'unexpected success';
});
export declare function Format(log: (...objs: any[]) => void): {
    LastLog(details: TestDetails): void;
    Covers(details: TestDetails): void;
    SearchResult(result: SearchResult<any>): void;
};
export declare const Stdout: {
    LastLog(details: TestDetails): void;
    Covers(details: TestDetails): void;
    SearchResult(result: SearchResult<any>): void;
};
export declare const Write: () => {
    messages: any[][];
    LastLog(details: TestDetails): void;
    Covers(details: TestDetails): void;
    SearchResult(result: SearchResult<any>): void;
};
export interface Property {
    /** Compares the values as if they were json objects using deep equality.
  
    If the values are not equal the two sides are put into the log. */
    equals(lhs: any, rhs: any): boolean;
    cover(pred: boolean, required_percentage: number, label: string): void;
    fail(msg: any): void;
    log(...msg: any[]): void;
    tap<A>(x: A, msg?: string): A;
}
export declare const defaultOptions: {
    tests: number;
    maxShrinks: number;
    seed: number | undefined;
    expectFailure: boolean;
};
export declare type Options = typeof defaultOptions;
export declare function testSize(test: number, numTests: number): number;
/** Searches for a counterexample and returns as most information as possible. */
export declare function search<A>(g: Gen<A>, prop: (a: A, p: Property) => boolean, options?: Partial<Options>): SearchResult<A>;
export declare function searchAndThen<R>(then: <A>(a: SearchResult<A>) => R): <A>(g: Gen<A>, prop: (a: A, p: Property) => boolean, options?: Partial<Options>) => R;
