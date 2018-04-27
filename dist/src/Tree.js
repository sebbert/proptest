"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    /** returns the last but leftmost subtree without any backtracking
     where the property is true */
    Tree.prototype.left_first_search = function (p, fuel) {
        if (fuel === void 0) { fuel = -1; }
        var b = p(this.top);
        if (b) {
            return dfs(b, p, this, fuel);
        }
        else {
            return undefined;
        }
    };
    Tree.prototype.left_first_search_async = function (p, fuel) {
        if (fuel === void 0) { fuel = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, p(this.top)];
                    case 1:
                        b = _a.sent();
                        if (b !== undefined) {
                            return [2 /*return*/, dfsAsync(b, p, this, fuel)];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Tree;
}());
exports.Tree = Tree;
/** Searches from the children of the tree */
function dfs(b, p, tree, fuel) {
    var child = Lz.force(tree.forest);
    while (child !== undefined) {
        if (fuel == 0) {
            break;
        }
        fuel--;
        var b2 = p(child.head.top);
        if (b2 !== undefined) {
            return dfs(b2, p, child.head, fuel);
        }
        child = Lz.force(child.tail);
    }
    return { match: b, fuel: fuel };
}
exports.dfs = dfs;
/** Searches from the children of the tree */
function dfsAsync(b, p, tree, fuel) {
    return __awaiter(this, void 0, void 0, function () {
        var child, b2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    child = Lz.force(tree.forest);
                    _a.label = 1;
                case 1:
                    if (!(child !== undefined)) return [3 /*break*/, 3];
                    if (fuel == 0) {
                        return [3 /*break*/, 3];
                    }
                    fuel--;
                    return [4 /*yield*/, p(child.head.top)];
                case 2:
                    b2 = _a.sent();
                    if (b2 !== undefined) {
                        return [2 /*return*/, dfsAsync(b2, p, child.head, fuel)];
                    }
                    child = Lz.force(child.tail);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, { match: b, fuel: fuel }];
            }
        });
    });
}
exports.dfsAsync = dfsAsync;
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
//# sourceMappingURL=Tree.js.map