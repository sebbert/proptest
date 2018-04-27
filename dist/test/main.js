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
var _this = this;
exports.__esModule = true;
var QC = require("../src/main");
var Gen = require("../src/main");
var Utils = require("../src/Utils");
var test = require("tape");
var check = QC.adaptTape(test);
var string_permute = function (s) { return Gen.permute(s.split('')).map(function (xs) { return xs.join(''); }); };
var assert = require("assert");
check('permute', Gen.record({
    a: string_permute('aaaaaaacaaaa'),
    b: string_permute('dbbbbbbbbbbb')
}), function (r) { return r.a < r.b; }, QC.expectFailure);
check.skip('skips false property', Gen.of({}), function (_) { return false; });
check('lower-upper record', Gen.record({ l: Gen.nestring(Gen.lower), u: Gen.nestring(Gen.upper) }).map(function (r) { return r.l + r.u; }), function (s) { return null != s.match(/^[a-z]+[A-Z]+$/); });
check('lower-upper sequence', Gen.sequence([Gen.nestring(Gen.lower), Gen.nestring(Gen.upper)]).map(function (xs) { return xs.join(''); }), function (s) { return null != s.match(/^[a-z]+[A-Z]+$/); });
check('lower-upper QC.expectFailure', Gen.sequence([Gen.nestring(Gen.lower), Gen.nestring(Gen.upper)]).map(function (xs) { return xs.join(''); }), function (s) { return null != s.match(/^([a-zA-Z]){0,20}$/); }, QC.expectFailure);
check('traverse homomorphic', Gen.nat.pojo().replicate(2), function (_a, p) {
    var a = _a[0], b = _a[1];
    var k = function (r) { return Utils.record_traverse(r, function (v, k) { return ({ k: k, v: v }); }); };
    return p.equals(k(a).concat(k(b)), k(__assign({}, a, b)));
}, QC.expectFailure);
check('traverse homomorphic with no overlap', Gen.nat.pojo().replicate(2), function (_a, p) {
    var a = _a[0], b = _a[1];
    var k = function (r) { return Utils.record_traverse(r, function (v, k) { return ({ k: k, v: v }); }); };
    var overlap = Object.keys(a).some(function (k) { return Object.keys(b).some(function (k2) { return k == k2; }); });
    p.cover(!overlap, 75, '!overlap');
    return overlap || p.equals(k(a).concat(k(b)), k(__assign({}, a, b)));
});
check('gen join left', Gen.record({ i: Gen.bin, seed: Gen.nat, size: Gen.pos }), function (d) {
    return Utils.deepEquals(Gen.of(Gen.of(d.i))
        .chain(function (g) { return g; })
        .sample(d.size, d.seed), Gen.of(d.i).sample(d.size, d.seed));
});
check('gen join right', Gen.record({ i: Gen.bin, seed: Gen.nat, size: Gen.pos }), function (d) {
    return Utils.deepEquals(Gen.of(d.i)
        .chain(function (j) { return Gen.of(j); })
        .sample(d.size, d.seed), Gen.of(d.i).sample(d.size, d.seed));
});
check('one', Gen.bin.one(), function (xs) { return xs.length == 1; });
check('two', Gen.bin.two(), function (xs) { return xs.length == 2; });
check('three', Gen.bin.three(), function (xs) { return xs.length == 3; });
check('four', Gen.bin.four(), function (xs) { return xs.length == 4; });
check('nat', Gen.nat, function (x) { return x >= 0; });
check('nat', Gen.nat, function (x) { return x > 0; }, QC.expectFailure);
check('nat', Gen.nat, function (x) { return x < 0; }, QC.expectFailure);
check('int', Gen.int, function (x) { return x >= 0; }, QC.expectFailure);
check('int', Gen.int, function (x) { return x <= 0; }, QC.expectFailure);
check('pos', Gen.pos, function (x) { return x > 0; });
check('pos', Gen.pos, function (x) { return x <= 0; }, QC.expectFailure);
check('neg', Gen.neg, function (x) { return x < 0; });
check('neg', Gen.neg, function (x) { return x >= 0; }, QC.expectFailure);
check('replicate', Gen.nat.replicate(10), function (xs) { return xs.length == 10; });
check('array', Gen.nat.array(), function (xs) { return xs.length >= 0; });
check('array', Gen.nat.array(), function (xs) { return xs.length > 0; }, QC.expectFailure);
check('nearray', Gen.nat.nearray(), function (xs) { return xs.length > 0; });
check('upper', Gen.upper, function (s) { return null != s.match(/^[A-Z]$/); });
check('lower', Gen.lower, function (s) { return null != s.match(/^[a-z]$/); });
check('alpha', Gen.alpha, function (s) { return null != s.match(/^[A-Za-z]$/); });
check('whitespace', Gen.whitespace, function (s) { return null != s.match(/^[ \n\t]$/); });
check('alphanum', Gen.alphanum, function (s) { return null != s.match(/^[A-Za-z0-9]$/); });
check('digit', Gen.digit, function (s) { return null != s.match(/^[0-9]$/); });
check('upper->lower', Gen.upper.map(function (u) { return u.toLowerCase(); }), function (s) { return null != s.match(/^[a-z]$/); });
check('char.string', Gen.char('ab').nestring(), function (s) { return s.length > 0; });
var within = function (l, x, u) { return x >= l && x < u; };
var R = Utils.fromTo(1, 4);
R.forEach(function (l) {
    return R.forEach(function (u) {
        return Math.abs(u - l) == 1 ||
            check("between(" + l + ", " + u + ")", Gen.between(u, l), function (x, p) {
                return Utils.fromTo(l, u + 1).forEach(function (i) { return p.cover(x == i, 20, i + ''); }) ||
                    within(Math.min(l, u), x, Math.max(l, u) + 1);
            });
    });
});
R.forEach(function (b) {
    return check("range(" + b + ")", Gen.range(b), function (x, p) { return Utils.range(b).forEach(function (i) { return p.cover(x == i, 20, i + ''); }) || within(0, x, b); });
});
var u32gens = {
    natural: QC.natural,
    positive: QC.positive.map(function (x) { return x - 1; }),
    integer: QC.integer.map(function (x) { return Math.abs(x); }),
    negative: QC.negative.map(function (x) { return -x; })
};
Utils.record_forEach(u32gens, function (g, name) {
    check('u32 distribution ' + name, g, function (x, p) {
        var mid = 1 << 30;
        p.cover(x < mid, 49, 'small');
        p.cover(x >= mid, 49, 'big');
        return true;
    }, QC.tests(10000));
    check('u32 range ' + name, g, function (x) { return within(0, x, ~(1 << 31)); }, QC.tests(10000));
});
check('integer negative distribution', QC.integer, function (x, p) { return p.cover(x < 0, 49, 'negative') || true; }, QC.tests(10000));
test('unexpected success', function (t) {
    var res = QC.search(Gen.nat, function (x) { return x >= 0; }, QC.expectFailure);
    var reason = res.ok ? '?' : res.reason;
    t.deepEquals(reason, 'unexpected success');
    t.end();
});
test('unexpected success', function (t) {
    var res = QC.search(Gen.nat, function (x) { return x > 0; }, QC.expectFailure);
    t.deepEquals(res.ok, true);
    t["true"](res.expectedFailure);
    t.end();
});
test('exception evaluating', function (t) {
    var res = QC.search(Gen.of({}), function (_) {
        throw 'OOPS';
    });
    t.deepEquals(res.ok, false);
    t.deepEquals(res.reason, 'exception');
    t.deepEquals(res.when, 'evaluating');
    t.end();
});
test('exception generating', function (t) {
    var res = QC.search(Gen.of({}).chain(function (_) {
        throw 'Oops';
    }), function (_) { return true; });
    t.deepEquals(res.ok, false);
    t.deepEquals(res.reason, 'exception');
    t.deepEquals(res.when, 'generating');
    t.end();
});
test('cov', function (t) {
    var res = QC.search(Gen.nat, function (x, p) {
        p.cover(x > 10, 75, '>10');
        return x >= 0;
    });
    var reason = res.ok ? '?' : res.reason;
    t.deepEquals(reason, 'insufficient coverage', JSON.stringify(res.covers));
    t.end();
});
check('permute', Gen.permute(Utils.range(5)), function (xs, p) {
    return true;
});
test('forall throws Error on false prop', function (t) {
    t.plan(1);
    t.throws(function () { return QC.assertForall(Gen.pos, function (x) { return x < 5; }); }, Error);
});
test("forall doesn't throw on true prop", function (t) {
    t.plan(1);
    t.doesNotThrow(function () { return QC.assertForall(Gen.pos, function (x) { return x > 0; }); });
});
test('forall exception contains the counterexample', function (t) {
    t.plan(2);
    try {
        QC.assertForall(Gen.oneof([Gen.of('apabepa'), Gen.alpha]), function (x) { return x != 'apabepa'; });
    }
    catch (e) {
        t["true"](e.message.toString().match(/^Counterexample found/m));
        t["true"](e.message.toString().match(/^"apabepa"/m));
    }
});
test('forall exceptions catches counterexamples, fully shrunk', function (t) {
    t.plan(3);
    try {
        QC.assertForall(QC.nat.replicate(2), function (_a) {
            var x = _a[0], y = _a[1];
            assert(x + 10 > y);
            return true;
        });
    }
    catch (e) {
        t["true"](e.message.toString().match(/^Exception when evaluating/m));
        t["true"](e.message.toString().match(/^Exception occured with this input/m));
        t["true"](e.message.toString().match(/^\[0, 10\]/m));
    }
});
function delay(x) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(x);
        }, 10);
    });
}
test('succeeding asynchronous forall passes', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, QC.assertForallAsync(QC.nat, function (n) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, delay(n)];
                            case 1: return [2 /*return*/, (_a.sent()) === n];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                t.pass("passed");
                t.end();
                return [2 /*return*/];
        }
    });
}); });
test('failing asynchronous forall fails with exception', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, QC.assertForallAsync(QC.nat, function (n) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, delay(n)];
                                case 1: return [2 /*return*/, (_a.sent()) === n + 1];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                t.fail();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                t.pass("passed");
                t.end();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*

const STree = <A>(g: Gen<A>) => GTree(g).map(t => t.force())

Utils.fromTo(1,20).map(i =>
  console.log({
      i,
      size: Utils.size(STree(Gen.alpha).replicate(10).sample(i)),
      ssize: Utils.size(STree(STree(Gen.alpha)).replicate(10).sample(i)),
      sssize: Utils.size(STree(STree(STree(Gen.alpha))).replicate(10).sample(i)),
      // aa: Utils.size(Gen.nat.array().array().replicate(100).sample(i)),
      raa: Utils.size(Gen.nat.resize(i => i / 4).array().array().replicate(100).sample(i)),
      ara: Utils.size(Gen.nat.array().resize(i => i / 4).array().replicate(100).sample(i)),
      aar: Utils.size(Gen.nat.array().array().resize(i => i / 4).replicate(100).sample(i)),
      arar: Utils.size(Gen.nat.array().resize(i => i / 2).array().resize(i => i / 2).replicate(100).sample(i)),
      // dblsize: Utils.size(STree(STree(Gen.alpha)).replicate(10).sample(i))
    })
  )
  */
//# sourceMappingURL=main.js.map