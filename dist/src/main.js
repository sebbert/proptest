"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var P = require("./Property");
var Property_1 = require("./Property");
exports.search = Property_1.search;
exports.searchAsync = Property_1.searchAsync;
exports.searchAndThen = Property_1.searchAndThen;
exports.searchAndThenAsync = Property_1.searchAndThenAsync;
var Gen_1 = require("./Gen");
exports.Gen = Gen_1.Gen;
__export(require("./Gen"));
exports.expectFailure = { expectFailure: true };
exports.randomSeed = { seed: undefined };
exports.seed = function (seed) { return ({ seed: seed }); };
exports.tests = function (tests) { return ({ tests: tests }); };
exports.maxShrinks = function (maxShrinks) { return ({ maxShrinks: maxShrinks }); };
/** Searches for a counterexample and prints it on stdout if it is found.

Returns whether a counterexample was found.

TODO: Remove in favour of forallStrings? */
exports.stdoutForall = Property_1.searchAndThen(function (res) {
    if (!res.ok) {
        P.Stdout.SearchResult(res);
    }
    return res.ok;
});
/** Searches for a counterexample and throws an error if one is found */
exports.assertForall = Property_1.searchAndThen(function (res) {
    if (!res.ok) {
        var w = P.Write();
        w.SearchResult(res);
        throw new Error(w.messages.map(function (xs) { return xs.join(' '); }).join('\n'));
    }
});
/** Searches for a counterexample to an asynchronous property and throws an error if one is found */
exports.assertForallAsync = Property_1.searchAndThenAsync(function (res) {
    if (!res.ok) {
        var w = P.Write();
        w.SearchResult(res);
        throw new Error(w.messages.map(function (xs) { return xs.join(' '); }).join('\n'));
    }
});
/** Searches for a counterexample and returns the result formatted as an array of strings */
exports.forallStrings = Property_1.searchAndThen(function (res) {
    var w = P.Write();
    w.SearchResult(res);
    return { ok: res.ok, messages: w.messages.map(function (xs) { return xs.join(' '); }) };
});
/** Searches for a counterexample to an asynchronous property and returns the result formatted as an array of strings */
exports.forallStringsAsync = Property_1.searchAndThenAsync(function (res) {
    var w = P.Write();
    w.SearchResult(res);
    return { ok: res.ok, messages: w.messages.map(function (xs) { return xs.join(' '); }) };
});
function createProperty(test) {
    var testCreator = (function (description, g, prop, options) {
        test(description, function () { return exports.assertForall(g, prop, options); });
    });
    var only = function (description, g, prop, options) {
        return test.only(description, function () { return exports.assertForall(g, prop, options); });
    };
    var skip = function (description, g, prop, options) {
        return test.skip(description, function () { return exports.assertForall(g, prop, options); });
    };
    testCreator.only = only;
    testCreator.skip = skip;
    return testCreator;
}
exports.createProperty = createProperty;
function _adapt_tape(test) {
    return function (name, g, prop, options) {
        return test(name, function (t) {
            var res = exports.forallStrings(g, prop, options);
            var _a = res.messages, head = _a[0], tail = _a.slice(1);
            if (res.ok) {
                t.pass(head);
            }
            if (!res.ok) {
                tail.forEach(function (msg) { return t.comment(msg); });
                t.fail(name + ': ' + head);
            }
            t.end();
        });
    };
}
/** Adapt tape using forallStrings */
function adaptTape(test) {
    var t = _adapt_tape(test);
    // typings for tape don't properly know there are only and skip methods
    t.only = _adapt_tape(test.only);
    t.skip = _adapt_tape(test.skip);
    return t;
}
exports.adaptTape = adaptTape;
//# sourceMappingURL=main.js.map