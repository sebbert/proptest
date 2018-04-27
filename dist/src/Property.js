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
        locally: function (f) {
            current_log = [];
            current_cover = {};
            return f();
        },
        locallyAsync: function (f) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            current_log = [];
                            current_cover = {};
                            return [4 /*yield*/, f()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
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
        },
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
function searchAsync(g, prop, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var i, msg, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = searchGenerator(g, options);
                    msg = i.next();
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 5];
                    if (!('ok' in msg.value)) return [3 /*break*/, 2];
                    return [2 /*return*/, msg.value];
                case 2: return [4 /*yield*/, msg.value.left_first_search_async(function (_a) {
                        var value = _a.a, p = _a.p;
                        return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var exception_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, p.locallyAsync(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, prop(value, p.api)];
                                            }); }); })];
                                    case 1:
                                        if (!(_b.sent())) {
                                            return [2 /*return*/, { value: value, log: p.last_log() }];
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        exception_1 = _b.sent();
                                        return [2 /*return*/, { value: value, exception: exception_1, log: p.last_log() }];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        });
                    })];
                case 3:
                    t = _a.sent();
                    if (t !== undefined) {
                        msg = i.next(__assign({}, t.match, { fuel: t.fuel }));
                    }
                    else {
                        msg = i.next(undefined);
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.searchAsync = searchAsync;
/** Searches for a counterexample and returns as most information as possible. */
function search(g, prop, options) {
    var i = searchGenerator(g, options);
    var msg = i.next();
    while (true) {
        if ('ok' in msg.value) {
            return msg.value;
        }
        else {
            var t = msg.value.left_first_search(function (_a) {
                var value = _a.a, p = _a.p;
                try {
                    if (!p.locally(function () { return prop(value, p.api); })) {
                        return { value: value, log: p.last_log() };
                    }
                }
                catch (exception) {
                    return { value: value, exception: exception, log: p.last_log() };
                }
            });
            if (t !== undefined) {
                msg = i.next(__assign({}, t.match, { fuel: t.fuel }));
            }
            else {
                msg = i.next(undefined);
            }
        }
    }
}
exports.search = search;
function searchGenerator(g, options) {
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
    var opts, p, not_ok, log, tests, t, to_search, res, shrinks, test_details, _i, _a, _b, data, label, expanded;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                opts = __assign({}, exports.defaultOptions, (options || {}));
                p = initProperty();
                not_ok = { ok: false };
                log = [];
                tests = 1;
                _c.label = 1;
            case 1:
                if (!(tests <= opts.tests)) return [3 /*break*/, 4];
                t = void 0;
                try {
                    t = g.sampleWithShrinks(testSize(tests - 1, opts.tests), opts.seed === undefined ? undefined : tests + opts.seed);
                }
                catch (exception) {
                    return [2 /*return*/, ret(__assign({}, not_ok, { reason: 'exception', exception: exception, when: 'generating' }, p.test_details(tests, [])))];
                }
                to_search = t.map(function (a) { return ({ a: a, p: p }); });
                return [4 /*yield*/, to_search
                    // .left_first_search(x => x !== undefined, opts.maxShrinks)
                ];
            case 2:
                res = _c.sent();
                // .left_first_search(x => x !== undefined, opts.maxShrinks)
                if (!res) {
                    return [3 /*break*/, 3];
                }
                shrinks = opts.maxShrinks == -1 ? -res.fuel : opts.maxShrinks - res.fuel;
                if ('exception' in res) {
                    return [2 /*return*/, ret(__assign({}, not_ok, { reason: 'exception', exception: res.exception, when: 'evaluating', counterexample: res.value, shrinks: shrinks }, p.test_details(tests, res.log)))];
                }
                else {
                    return [2 /*return*/, ret(__assign({}, not_ok, { reason: 'counterexample', counterexample: res.value, shrinks: shrinks }, p.test_details(tests, res.log)))];
                }
                _c.label = 3;
            case 3:
                ++tests;
                return [3 /*break*/, 1];
            case 4:
                test_details = p.test_details(opts.tests, []);
                for (_i = 0, _a = Utils.record_traverse(test_details.covers, function (data, label) { return ({
                    data: data,
                    label: label
                }); }); _i < _a.length; _i++) {
                    _b = _a[_i], data = _b.data, label = _b.label;
                    expanded = expand_cover_data(data);
                    if (expanded.pct < data.req) {
                        return [2 /*return*/, ret(__assign({}, not_ok, { reason: 'insufficient coverage', label: label }, test_details))];
                    }
                }
                return [4 /*yield*/, ret(__assign({ ok: true }, test_details))];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}
function searchAndThen(then) {
    return function (g, prop, options) { return then(search(g, prop, options)); };
}
exports.searchAndThen = searchAndThen;
function searchAndThenAsync(then) {
    var _this = this;
    return function (g, prop, options) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = then;
                return [4 /*yield*/, searchAsync(g, prop, options)];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    }); }); };
}
exports.searchAndThenAsync = searchAndThenAsync;
//# sourceMappingURL=Property.js.map