"use strict";
exports.__esModule = true;
var QC = require("../src/main");
var Gen = require("../src/main");
var Utils = require("../src/Utils");
var test = require("tape");
var check = QC.adaptTape(test);
check('shrinks to a small list of small nats', Gen.nat.array().small(), function (target, p) {
    var r = QC.search(Gen.nat.replicate(target.length), function (xs) { return xs.some(function (x, i) { return x < target[i]; }); }, QC.maxShrinks(1000));
    if (!r.ok && r.reason == 'counterexample') {
        return p.equals(r.counterexample, target);
    }
    else {
        return false;
    }
});
check('shrinks to a list of zeroes', Gen.nat, function (i, p) {
    var target = Utils.range(i).map(function (_) { return 0; });
    var r = QC.search(Gen.bin.array().big(), function (xs) { return xs.length < i; }, QC.maxShrinks(i * 20));
    if (!r.ok && r.reason == 'counterexample') {
        return p.equals(r.counterexample, target);
    }
    else {
        return false;
    }
}, QC.tests(20));
test("shrinking finds counter example in few steps", function (t) {
    t.plan(2);
    var found = false;
    var called = 0;
    var r = QC.search(Gen.natural, function (x) {
        var result = x < 10000;
        if (result === false) {
            if (found) {
                called++;
            }
            else {
                found = true;
            }
        }
        return result;
    }, QC.maxShrinks(1000));
    t.ok(called < 25);
    if (!r.ok && r.reason == 'counterexample') {
        t.deepEquals(r.counterexample, 10000);
    }
});
check('binary search natural', Gen.natural.map(function (i) { return Math.ceil(i * 0.75); }), function (i) {
    var r = QC.search(Gen.natural, function (x) { return x < i; }, QC.maxShrinks(500));
    if (!r.ok && r.reason == 'counterexample') {
        return r.counterexample === i;
    }
    else {
        return false;
    }
});
check('binary search float', Gen.floatBetween(0, 1 << 29), function (i) {
    var r = QC.search(Gen.floatBetween(0, 1 << 30), function (x) { return x < i; }, QC.maxShrinks(500));
    if (!r.ok && r.reason == 'counterexample') {
        var d = Math.abs(r.counterexample - i);
        return d < 1;
    }
    else {
        return false;
    }
});
check('binary search three naturals', Gen.natural.map(function (i) { return Math.ceil(i * 0.5); }).three(), function (is, p) {
    var r = QC.search(Gen.natural.three(), function (xs) { return xs.some(function (x, i) { return x < is[i]; }); }, QC.maxShrinks(5000));
    if (!r.ok && r.reason == 'counterexample') {
        return p.equals(r.counterexample, is);
    }
    else {
        return false;
    }
}, QC.tests(20));
test('smallest failing log returned after shrinking', function (t) {
    var last = null;
    var r = QC.search(Gen.natural, function (x, p) {
        last = x;
        p.log(x);
        return x < 84000;
    });
    if (!r.ok && r.reason == 'counterexample') {
        t.equal(r.counterexample, 84000);
        t.deepEqual(r.log, [[84000]]);
        t.deepEqual(last, 83999);
        t.end();
    }
    else {
        t.fail();
    }
});
//# sourceMappingURL=shrinking.js.map