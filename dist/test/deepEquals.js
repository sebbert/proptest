"use strict";
exports.__esModule = true;
var test = require("tape");
var Utils = require("../src/Utils");
test('deepEquals', function (t) {
    var diff = [
        [],
        {},
        null,
        undefined,
        false,
        true,
        0,
        1,
        '',
        '0',
        '1',
        'a',
        { '': 0 },
        { a: { b: 1 } },
        { a: { b: 2 } },
        { a: { d: 1 } },
    ];
    diff.push.apply(diff, diff.map(function (x) { return [[x]]; }));
    diff.push.apply(diff, diff.map(function (x) { return [x]; }));
    var comparisons = 0;
    diff.forEach(function (x, i) {
        return diff.forEach(function (y, j) {
            var xy = JSON.stringify(x) + ' ' + JSON.stringify(y);
            if (i === j) {
                Utils.deepEquals(x, y) || t.fail(xy);
            }
            else {
                !Utils.deepEquals(x, y) || t.fail(xy);
            }
            comparisons++;
        });
    });
    t.pass("Passed " + comparisons + " comparisons.");
    t.end();
});
//# sourceMappingURL=deepEquals.js.map