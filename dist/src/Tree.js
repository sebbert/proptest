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
var Lz = require("./lazylist");
var Tree = /** @class */ (function () {
    function Tree(top, forest) {
        this.top = top;
        this.forest = forest;
    }
    Tree.of = function (a) {
        return new Tree(a, Lz.nil);
    };
    Tree.tree = function (top, forest) {
        return new Tree(top, forest);
    };
    Tree.tree$ = function (top, forest) {
        return new Tree(top, Lz.fromArray(forest));
    };
    Tree.prototype.map = function (f) {
        return this.chain(function (a) { return Tree.of(f(a)); });
    };
    Tree.prototype.chain = function (f) {
        var t = f(this.top);
        return new Tree(t.top, Lz.concat(Lz.map(function (t) { return t.chain(f); }, this.forest), t.forest));
    };
    Tree.prototype.left_first_pair = function (tb) {
        return this.chain(function (a) { return tb.chain(function (b) { return Tree.of(Utils.pair(a, b)); }); });
    };
    Tree.prototype.fair_pair = function (tb) {
        return Tree.dist({ a: this, b: tb }).map(function (p) { return Utils.pair(p.a, p.b); });
    };
    /** returns the last but leftmost subtree without any backtracking
     where the property is true */
    Tree.prototype.left_first_search = function (p, fuel) {
        if (fuel === void 0) { fuel = -1; }
        if (p(this.top)) {
            return dfs(p, this, fuel);
        }
        else {
            return undefined;
        }
    };
    /** distribute fairly */
    Tree.dist = function (trees) {
        var keys = Object.keys(trees);
        function shrink_one(k) {
            return Lz.map(function (t) {
                return Tree.dist(__assign({}, trees, (_a = {}, _a[k] = t, _a)));
                var _a;
            }, trees[k].forest);
        }
        return new Tree(Utils.dict(keys, function (k) { return trees[k].top; }), Lz.flatten(Lz.map(shrink_one, Lz.fromArray(keys))));
    };
    /** distribute array fairly */
    Tree.dist_array = function (trees) {
        var length = trees.length;
        return Tree.dist(trees).map(function (t) { return Array.from(__assign({}, t, { length: length })); });
    };
    /** debugging function to view the tree evaluated */
    Tree.prototype.force = function (depth) {
        if (depth === void 0) { depth = -1; }
        return {
            top: this.top,
            forest: depth == 0 ? [] : Lz.toArray(this.forest).map(function (t) { return t.force(depth - 1); })
        };
    };
    return Tree;
}());
exports.Tree = Tree;
var resolution = 0.01;
// less(a, b) is "morally" abs a < abs b, but taking care of overflow.
function less(a, b) {
    var nna = a >= 0;
    var nnb = b >= 0;
    if (nna && nnb) {
        return a < b;
    }
    else if (!nna && !nnb) {
        return a > b;
    }
    else if (nna && !nnb) {
        return a + b < 0;
    }
    else {
        return a + b > 0;
    }
}
var half = function (i) { return Math.floor(i / 2); };
// This is Test.QuickCheck.Arbitrary.shrinkIntegral from Haskell QuickCheck:
// https://github.com/nick8325/quickcheck/blob/0d547a497b6608c34310ab604f63e4ee6721fd21/Test/QuickCheck/Arbitrary.hs#L1079
function halves(x) {
    if (x != Math.round(x)) {
        return halves(Math.round(x));
    }
    return Lz.takeWhile(function (i) { return less(i, x); }, Lz.cons(0, Lz.map(function (i) { return x - i; }, Lz.iterate(half(x), half))));
}
function shrinkNumber(n, towards) {
    if (towards === void 0) { towards = 0; }
    if (towards != 0) {
        return shrinkNumber(towards - n).map(function (i) { return towards - i; });
    }
    else if (n < 0) {
        return shrinkNumber(-n).map(function (i) { return -i; });
    }
    else {
        return (function go(x) {
            return new Tree(x, Lz.map(go, halves(x)));
        })(n);
    }
}
exports.shrinkNumber = shrinkNumber;
/** Assumes that the property already holds for the top of the tree. */
function dfs(p, tree, fuel) {
    var child = Lz.force(tree.forest);
    while (child !== undefined) {
        if (fuel == 0) {
            break;
        }
        fuel--;
        if (p(child.head.top)) {
            return dfs(p, child.head, fuel);
        }
        child = Lz.force(child.tail);
    }
    return { tree: tree, fuel: fuel };
}
exports.dfs = dfs;
//# sourceMappingURL=Tree.js.map