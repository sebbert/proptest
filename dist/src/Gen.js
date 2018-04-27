"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var Utils = require("./Utils");
var Tree_1 = require("./Tree");
var Random = require("random-js");
var Gen = /** @class */ (function () {
    function Gen(gen) {
        this.gen = gen;
    }
    Gen.of = function (a) {
        return new Gen(function () { return Tree_1.Tree.of(a); });
    };
    Gen.prototype.map = function (f) {
        var _this = this;
        return new Gen(function (env) { return _this.gen(env).map(f); });
    };
    Gen.prototype.chain = function (f) {
        var _this = this;
        return new Gen(function (env) {
            // could distribute size over the two arms here
            var ta = _this.gen(env);
            return ta.chain(function (a) {
                var fa = f(a);
                return fa.gen(env);
            });
        });
    };
    Gen.prototype.withTree = function (f) {
        var _this = this;
        return new Gen(function (env) { return f(_this.gen(env)); });
    };
    /*
    replaceShrinks(f: (forest: Tree<A>[]) => Tree<A>[]): Gen<A> {
      return new Gen(env => {
        const {top, forest} = this.gen(env)
        return new Tree(top, () => f(forest()))
      })
    }
    */
    Gen.prototype.sample = function (size, seed) {
        if (size === void 0) { size = 10; }
        return this.sampleWithShrinks(size, seed).top;
    };
    Gen.prototype.sampleWithShrinks = function (size, seed) {
        if (size === void 0) { size = 10; }
        return this.gen({ rng: seedToRandom(seed), size: size });
    };
    Gen.prototype.wrap = function (k) {
        return record((_a = {}, _a[k] = this, _a));
        var _a;
    };
    Gen.prototype.pair = function (b) {
        return pair(this, b);
    };
    Gen.prototype.replicate = function (n) {
        return replicate(n, this);
    };
    Gen.prototype.pojo = function (keygen) {
        return pojo(this, keygen);
    };
    Gen.prototype.array = function () {
        return array(this);
    };
    Gen.prototype.nearray = function () {
        return nearray(this);
    };
    Gen.prototype.small = function () {
        return small(this);
    };
    Gen.prototype.big = function () {
        return big(this);
    };
    Gen.prototype.huge = function () {
        return huge(this);
    };
    Gen.prototype.pow = function (exponent) {
        return pow(exponent, this);
    };
    Gen.prototype.one = function () {
        return one(this);
    };
    Gen.prototype.two = function () {
        return two(this);
    };
    Gen.prototype.three = function () {
        return three(this);
    };
    Gen.prototype.four = function () {
        return four(this);
    };
    return Gen;
}());
exports.Gen = Gen;
function seedToRandom(seed) {
    var mt0 = Random.engines.mt19937();
    var mt = (seed && mt0.seed(seed)) || mt0.autoSeed();
    return new Random(mt);
}
function trees(gs, f) {
    return new Gen(function (env) { return f(gs.map(function (g) { return g.gen(env); })); });
}
function size() {
    return new Gen(function (env) { return Tree_1.shrinkNumber(env.size, 0); });
}
function resize(op, g) {
    return new Gen(function (env) { return g.gen(__assign({}, env, { size: Math.max(1, Math.round(op(env.size))) })); });
}
exports.resize = resize;
//////////////////////////////////////////////////////////////////////
// Generator combinators
function record(r) {
    var keys = Object.keys(r);
    var ts = keys.map(function (k) { return r[k]; });
    return trees(ts, function (arr) { return Tree_1.Tree.dist(Utils.dict(keys, function (_k, i) { return arr[i]; })); });
}
exports.record = record;
function sequence(gs) {
    return trees(gs, Tree_1.Tree.dist_array);
}
exports.sequence = sequence;
function choose(xs) {
    if (xs.length == 0) {
        throw 'choose empty array';
    }
    else {
        return range(xs.length).map(function (i) { return xs[i]; });
    }
}
exports.choose = choose;
function oneof(gs) {
    return choose(gs).chain(function (g) { return g; });
}
exports.oneof = oneof;
function frequency(table) {
    return lazyFrequency(table.map(function (_a) {
        var i = _a[0], g = _a[1];
        return Utils.pair(i, function () { return g; });
    }));
}
exports.frequency = frequency;
function lazyFrequency(table) {
    var sum = 0;
    table.forEach(function (_a) {
        var f = _a[0], g = _a[1];
        if (f >= 0) {
            sum += f;
        }
    });
    return range(sum).chain(function (i) {
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var _a = table_1[_i], f = _a[0], g = _a[1];
            if (f > 0) {
                i -= f;
            }
            if (i < 0) {
                return g();
            }
        }
        throw 'frequency unreachable';
    });
}
exports.lazyFrequency = lazyFrequency;
//////////////////////////////////////////////////////////////////////
// Member generator combinators
/** The constant generator: always generates the supplied value */
function of(a) {
    return Gen.of(a);
}
exports.of = of;
function pair(ga, gb) {
    return new Gen(function (env) {
        var ta = ga.gen(env);
        var tb = gb.gen(env);
        return ta.fair_pair(tb);
    });
}
exports.pair = pair;
function replicate(n, g) {
    if (n <= 0) {
        return Gen.of([]);
    }
    else {
        return pair(g, replicate(n - 1, g)).map(function (_a) {
            var x = _a[0], xs = _a[1];
            return [x].concat(xs);
        });
    }
}
exports.replicate = replicate;
function pojo(v, k) {
    if (k === void 0) { k = exports.lower.nestring().small(); }
    return record({ k: k, v: v })
        .array()
        .map(Utils.record_create);
}
exports.pojo = pojo;
function array(g) {
    return exports.nat.chain(function (i) { return replicate(i, g); });
}
exports.array = array;
function nearray(g) {
    return exports.pos.chain(function (i) { return replicate(i, g); });
}
exports.nearray = nearray;
function small(g) {
    return pow(0.5, g);
}
exports.small = small;
function big(g) {
    return pow(1.5, g);
}
exports.big = big;
function huge(g) {
    return pow(2, g);
}
exports.huge = huge;
function pow(exponent, g) {
    return resize(function (x) { return Math.pow(x, exponent); }, g);
}
exports.pow = pow;
function one(g) {
    return g.replicate(1);
}
exports.one = one;
function two(g) {
    return g.replicate(2);
}
exports.two = two;
function three(g) {
    return g.replicate(3);
}
exports.three = three;
function four(g) {
    return g.replicate(4);
}
exports.four = four;
//////////////////////////////////////////////////////////////////////
// Generators of primitives
/** max exclusive */
function range(max) {
    return between(0, max - 1);
}
exports.range = range;
/** max exclusive */
function floatRange(max) {
    if (max === void 0) { max = 1; }
    return floatBetween(0, max);
}
exports.floatRange = floatRange;
/** hi inclusive */
function between(lo, hi) {
    return _between(lo, hi + 1, function (rng, lo, hi) { return rng.integer(lo, hi - 1); });
}
exports.between = between;
/** hi exclusive */
function floatBetween(lo, hi) {
    return _between(lo, hi, function (rng, lo, hi) { return rng.real(lo, hi); });
}
exports.floatBetween = floatBetween;
/** hi exclusive */
function _between(lo, hi, random) {
    var w0 = hi - lo;
    if (hi === undefined || lo === undefined) {
        throw 'Range bounds must be proper numbers:' + { hi: hi, lo: lo };
    }
    if (w0 < 0) {
        return _between(hi, lo, random).map(function (x) { return hi - x + lo; });
    }
    else if (w0 == 0) {
        throw new Error('range of zero width');
    }
    else {
        return new Gen(function (env) {
            var w = hi - lo;
            // Math.max(1, Math.min(w0, Math.ceil(w0 * r)))
            return Tree_1.shrinkNumber(random(env.rng, lo, lo + w), lo);
        });
    }
}
/** Generate a binary number (0 or 1) */
exports.bin = choose([0, 1]);
/** Generate a small natural number */
exports.nat = size().chain(function (size) { return range(size + 1); });
/** Generate a small integer */
exports.int = oneof([exports.nat, exports.nat.map(function (x) { return -x; })]);
/** Generate a small positive number */
exports.pos = exports.nat.map(function (x) { return x + 1; });
/** Generate a small negative number */
exports.neg = exports.nat.map(function (x) { return -x - 1; });
var min32 = 1 << 31;
var max32 = ~(1 << 31);
/** Generate a nonnegative i32 */
exports.natural = between(0, max32);
/** Generate any i32 */
exports.integer = between(min32, max32);
/** Generate a positive i32 */
exports.positive = between(1, max32);
/** Generate a negative i32 */
exports.negative = between(min32, -1);
exports.bool = choose([false, true]);
//////////////////////////////////////////////////////////////////////
// Character generators
function string(g, sep) {
    if (sep === void 0) { sep = ''; }
    return array(g).map(function (xs) { return xs.join(sep); });
}
exports.string = string;
function nestring(g, sep) {
    if (sep === void 0) { sep = ''; }
    return nearray(g).map(function (xs) { return xs.join(sep); });
}
exports.nestring = nestring;
function blessGenChar(g) {
    var gc = g;
    gc.string = function (sep) { return blessGenChar(string(g, sep)); };
    gc.nestring = function (sep) { return blessGenChar(nestring(g, sep)); };
    return gc;
}
exports.blessGenChar = blessGenChar;
/** hi inclusive */
function charRange(lo, hi) {
    return blessGenChar(between(lo.charCodeAt(0), hi.charCodeAt(0)).map(function (i) { return String.fromCharCode(i); }));
}
exports.charRange = charRange;
function char(chars) {
    if (chars.length == 0) {
        throw 'choose empty string';
    }
    else {
        return blessGenChar(range(chars.length).map(function (i) { return chars[i]; }));
    }
}
exports.char = char;
exports.digit = charRange('0', '9');
exports.lower = charRange('a', 'z');
exports.upper = charRange('A', 'Z');
exports.alpha = blessGenChar(oneof([exports.lower, exports.upper]));
exports.alphanum = blessGenChar(oneof([exports.alpha, exports.digit]));
exports.ascii = charRange('!', '~');
exports.whitespace = char(" \n\t");
//////////////////////////////////////////////////////////////////////
// Exotic generators
function concat(gs, sep) {
    if (sep === void 0) { sep = ''; }
    return sequence(gs).map(function (xs) { return xs.join(sep); });
}
exports.concat = concat;
/** Permute using Fisher-Yates shuffle */
function permute(xs) {
    var m_swaps = [];
    var _loop_1 = function (i) {
        m_swaps.push(between(i, xs.length - 1).map(function (j) { return ({ i: i, j: j }); }));
    };
    for (var i = 0; i < xs.length - 1; i++) {
        _loop_1(i);
    }
    return sequence(m_swaps).map(function (swaps) {
        var ys = xs.slice();
        swaps.forEach(function (_a) {
            var j = _a.j, i = _a.i;
            ;
            _b = [ys[j], ys[i]], ys[i] = _b[0], ys[j] = _b[1];
            var _b;
        });
        return ys;
    });
}
exports.permute = permute;
function rec(g) {
    return letrec({
        me: function (tie, size) {
            return g(function (size) { return tie.me(size); }, size);
        }
    }).me;
}
exports.rec = rec;
function letrecSized(size0, generators) {
    var tie = Utils.record_map(generators, function (_, k) { return function (size) { return letrecSized(size === undefined ? size0 - 1 : size, generators)[k]; }; });
    return Utils.record_map(generators, function (f) { return f(tie, Math.max(0, Math.floor(size0))); });
}
function letrec(generators) {
    return Utils.record_map(generators, function (f, k) {
        return exports.pos.chain(function (size0) { return letrecSized(size0, generators)[k]; });
    });
}
exports.letrec = letrec;
//# sourceMappingURL=Gen.js.map