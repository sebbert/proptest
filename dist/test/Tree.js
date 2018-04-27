"use strict";
exports.__esModule = true;
var Tree_1 = require("../src/Tree");
var Lz = require("../src/lazylist");
var QC = require("../src/main");
var Gen = require("../src/main");
var Utils = require("../src/Utils");
var test = require("tape");
var check = QC.adaptTape(test);
test('dfs only forces the path it takes', function (t) {
    t.plan(1);
    var called = 0;
    var tree = Tree_1.shrinkNumber(100000, 0).map(function (n) {
        called++;
        return n;
    });
    tree.left_first_search(function (n) { return n > 0; });
    t.ok(called < 40);
});
var recTree = function (g) {
    return Gen.rec(function (tie, size) {
        return g.chain(function (top) {
            return (size > 0 ? Gen.between(2, 5) : Gen.of(0)).chain(function (n) {
                return tie(size / (n + 1))
                    .replicate(n)
                    .map(function (forest) { return new Tree_1.Tree(top, Lz.fromArray(forest)); });
            });
        });
    });
};
var letrecTree = function (g) {
    return Gen.letrec({
        Tree: function (tie, size) {
            return g.chain(function (top) {
                return (size > 0 ? Gen.between(2, 5) : Gen.of(1)).chain(function (n) {
                    return tie.List(size / n).map(function (forest) { return new Tree_1.Tree(top, forest); });
                });
            });
        },
        List: function (tie, size) {
            return Gen.lazyFrequency([
                [1, function () { return Gen.of(Lz.nil); }],
                [size, function () { return tie.Tree().chain(function (x) { return tie.List().map(function (xs) { return Lz.cons(x, xs); }); }); }],
            ]);
        }
    });
};
var versions = {
    rec: recTree(Gen.bin),
    letrec: letrecTree(Gen.bin).Tree
};
Utils.record_forEach(versions, function (TreeGen, version) {
    var tap = function (a) { return console.log(JSON.stringify(a, undefined, 2)) || a; };
    check(version + ' tree join left', TreeGen, function (t, p) {
        return p.equals(Tree_1.Tree.of(t)
            .chain(function (t) { return t; })
            .force(), t.force());
    });
    check(version + ' tree join right', TreeGen, function (t, p) {
        return p.equals(t.chain(function (j) { return Tree_1.Tree.of(j); }).force(), t.force());
    });
});
//# sourceMappingURL=Tree.js.map