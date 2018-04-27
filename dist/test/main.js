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