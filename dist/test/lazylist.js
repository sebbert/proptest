"use strict";
exports.__esModule = true;
var Lz = require("../src/lazylist");
var QC = require("../src/main");
var Gen = require("../src/main");
var test = require("tape");
var check = QC.adaptTape(test);
var ListGen = function (g) {
    return Gen.rec(function (tie, size) {
        return Gen.frequency([
            [1, Gen.of(Lz.nil)],
            [size, g.chain(function (x) { return tie().map(function (xs) { return Lz.cons(x, xs); }); })],
        ]);
    });
};
check('assoc', ListGen(Gen.bin).three(), function (_a, p) {
    var a = _a[0], b = _a[1], c = _a[2];
    return p.equals(Lz.toArray(Lz.concat(a, Lz.concat(b, c))), Lz.toArray(Lz.concat(Lz.concat(a, b), c)));
});
check('left ident', ListGen(Gen.bin), function (a, p) {
    return p.equals(Lz.toArray(Lz.concat(Lz.nil, a)), Lz.toArray(a));
});
check('right ident', ListGen(Gen.bin), function (a, p) {
    return p.equals(Lz.toArray(Lz.concat(a, Lz.nil)), Lz.toArray(a));
});
//# sourceMappingURL=lazylist.js.map