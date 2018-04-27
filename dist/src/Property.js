"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var Utils = require("./Utils");
function expand_cover_data(data) {
    var N = data.hit + data.miss;
    var ratio = data.hit * 1.0 / N;
    var pct = 100 * ratio;
    return { N: N, ratio: ratio, pct: pct };
}
exports.expand_cover_data = expand_cover_data;
function Format(log) {
    return {
        LastLog: function (details) {
            details.log.forEach(function (objs) { return log.apply(void 0, objs); });
        },
        Covers: function (details) {
            Utils.record_forEach(details.covers, function (data, label) {
                var expanded = expand_cover_data(data);
                log(Utils.pct(expanded.pct), '/' + Utils.pct(data.req), ' ', label);
            });
        },
        SearchResult: function (result) {
            if (result.ok) {
                if (result.expectedFailure) {
                    log("failing as expected");
                    this.SearchResult(result.expectedFailure);
                    log("(expected failure)");
                }
                else {
                    log("passed " + result.tests + " tests");
                }
            }
            else {
                switch (result.reason) {
                    case 'counterexample':
                        log("Counterexample found after " + result.tests + " tests and " + result.shrinks + " shrinks");
                        log(Utils.show(result.counterexample));
                        break;
                    case 'exception':
                        log("Exception when " + result.when + " after " + result.tests + " tests:");
                        log(result.exception);
                        if (result.when == 'evaluating') {
                            log("Exception occured with this input after " + result.shrinks + " shrinks:");
                            log(Utils.show(result.counterexample));
                        }
                        break;
                    case 'insufficient coverage':
                        log("Insufficient coverage for label " + result.label);
                        break;
                    case 'unexpected success':
                        log("Unexpected success in presence of expectFailure");
                        break;
                    default:
                        var _ = result;
                }
                this.Covers(result);
                this.LastLog(result);
            }
        }
    };
}
exports.Format = Format;
exports.Stdout = Format(function () {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    return console.log.apply(console, msg);
});
exports.Write = function () {
    var messages = [];
    return __assign({}, Format(function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        return messages.push(msg);
    }), { messages: messages });
};
function initProperty() {
    var current_log = [];
    var current_cover = {};
    var cover_req = {};
    var cover_hit = {};
    var cover_miss = {};
    var sealed = false;
    return {
        api: {
            tap: function (x, msg) {
                msg && current_log.push([msg, Utils.show(x)]);
                msg || current_log.push([Utils.show(x)]);
                return x;
            },
            log: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                current_log.push(msg);
            },
            cover: function (pred, req, label) {
                var req0 = cover_req[label];
                if (req0 !== undefined && req0 != req) {
                    throw "Different coverage requirements for " + label + ": " + req0 + " and " + req;
                }
                if (current_cover[label]) {
                    throw "Label already registered: " + label;
                }
                current_cover[label] = true;
                cover_req[label] = req;
                if (pred) {
                    Utils.succ(cover_hit, label);
                }
                else {
                    Utils.succ(cover_miss, label);
                }
            },
            fail: function (msg) {
                throw msg;
            },
            equals: function (lhs, rhs) {
                var e = Utils.deepEquals(lhs, rhs);
                if (!e) {
                    this.log('Not deeply equal:');
                    var a = Utils.show(lhs);
                    var b = Utils.show(rhs);
                    if (-1 != a.indexOf('\n') || -1 != b.indexOf('\n')) {
                        this.log(a + '\n!=\n' + b);
                    }
                    else {
                        this.log(a + ' != ' + b);
                    }
                }
                return e;
            }
        },
        round: function (f) {
            current_log = [];
            current_cover = {};
            return f();
        },
        last_log: function () {
            return current_log;
        },
        test_details: function (tests, log) {
            return {
                covers: Utils.record_map(cover_req, function (req, label) { return ({
                    req: req,
                    hit: cover_hit[label],
                    miss: cover_miss[label]
                }); }),
                log: log,
                tests: tests
            };
        }
    };
}
exports.defaultOptions = {
    tests: 100,
    maxShrinks: 1000,
    seed: 43,
    expectFailure: false
};
function testSize(test, numTests) {
    var subtract = 100 * Math.floor(test / 100);
    if (subtract > 0) {
        return testSize(test - subtract, numTests - subtract);
    }
    else {
        var factor = 100 / Math.min(100, numTests);
        return 1 + test * factor;
    }
}
exports.testSize = testSize;
/** Searches for a counterexample and returns as most information as possible. */
function search(g, prop, options) {
    var opts = __assign({}, exports.defaultOptions, (options || {}));
    var p = initProperty();
    var not_ok = { ok: false };
    var log = [];
    function ret(res) {
        if (opts.expectFailure) {
            if (res.ok) {
                var expectedFailure = res.expectedFailure, rest = __rest(res, ["expectedFailure"]);
                return __assign({}, rest, not_ok, { reason: 'unexpected success' });
            }
            else {
                return __assign({}, res, { ok: true, expectedFailure: res });
            }
        }
        else {
            return res;
        }
    }
    for (var tests = 1; tests <= opts.tests; ++tests) {
        var t = void 0;
        try {
            t = g.sampleWithShrinks(testSize(tests - 1, opts.tests), opts.seed === undefined ? undefined : tests + opts.seed);
        }
        catch (exception) {
            return ret(__assign({}, not_ok, { reason: 'exception', exception: exception, when: 'generating' }, p.test_details(tests, [])));
        }
        var evaluated = t.map(function (value) {
            try {
                var res_1 = p.round(function () { return prop(value, p.api); });
                if (!res_1) {
                    log = p.last_log();
                    return { value: value };
                }
            }
            catch (exception) {
                log = p.last_log();
                return { value: value, exception: exception };
            }
        });
        var res = evaluated.left_first_search(function (x) { return x !== undefined; }, opts.maxShrinks);
        if (!res) {
            continue;
        }
        var top_1 = res.tree.top;
        var shrinks = opts.maxShrinks == -1 ? -res.fuel : opts.maxShrinks - res.fuel;
        if (top_1 === undefined) {
            continue;
        }
        else if ('exception' in top_1) {
            return ret(__assign({}, not_ok, { reason: 'exception', exception: top_1.exception, when: 'evaluating', counterexample: top_1.value, shrinks: shrinks }, p.test_details(tests, log)));
        }
        else {
            return ret(__assign({}, not_ok, { reason: 'counterexample', counterexample: top_1.value, shrinks: shrinks }, p.test_details(tests, log)));
        }
    }
    var test_details = p.test_details(opts.tests, []);
    for (var _i = 0, _a = Utils.record_traverse(test_details.covers, function (data, label) { return ({
        data: data,
        label: label
    }); }); _i < _a.length; _i++) {
        var _b = _a[_i], data = _b.data, label = _b.label;
        var expanded = expand_cover_data(data);
        if (expanded.pct < data.req) {
            return ret(__assign({}, not_ok, { reason: 'insufficient coverage', label: label }, test_details));
        }
    }
    return ret(__assign({ ok: true }, test_details));
}
exports.search = search;
function searchAndThen(then) {
    return function (g, prop, options) { return then(search(g, prop, options)); };
}
exports.searchAndThen = searchAndThen;
//# sourceMappingURL=Property.js.map