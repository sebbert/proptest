export declare function pair<A, B>(a: A, b: B): [A, B];
export declare function record<K extends string, V>(handle: (write: (k: K, v: V) => void) => void): Record<K, V>;
export declare function dict<K extends string, V>(keys: K[], f: (k: K, index: number) => V): Record<K, V>;
export declare function flatten<X>(xss: X[][]): X[];
export declare function range(to: number): number[];
export declare function fromTo(begin: number, end: number): number[];
export declare function charRange(begin: string, end: string): string[];
export declare function record_create<K extends string, V>(xs: {
    k: K;
    v: V;
}[]): Record<K, V>;
export declare function record_forEach<K extends string, A>(x: Record<K, A>, k: (a: A, id: K) => void): void;
export declare function record_traverse<K extends string, A, B>(x: Record<K, A>, k: (a: A, id: K) => B, sort_keys?: boolean): B[];
export declare function record_map<K extends string, A, B>(x: Record<K, A>, k: (a: A, id: K) => B): Record<K, B>;
export declare function deepEquals(x: any, y: any): boolean;
export declare function size(x: any): number;
export declare const pct: (i: number) => string;
export declare function succ(x: Record<string, number>, s: string): number;
export declare const serialize: (s: any) => string;
/** Show a JSON object with indentation */
export declare function show(x: any): string;
