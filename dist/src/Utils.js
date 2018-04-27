"use strict";
exports.__esModule = true;
function pair(a, b) {
    return [a, b];
}
exports.pair = pair;
function record(handle) {
    var obj = {};
    handle(function (k, v) { return (obj[k] = v); });
    return obj;
}
exports.record = record;
function dict(keys, f) {
    return record(function (w) { return keys.map(function (k, i) { return w(k, f(k, i)); }); });
}
exports.dict = dict;
function flatten(xss) {
    return (_a = []).concat.apply(_a, xss);
    var _a;
}
exports.flatten = flatten;
function range(to) {
    return fromTo(0, to);
}
exports.range = range;
function fromTo(begin, end) {
    var out = [];
    for (var i = begin; i < end; ++i) {
        out.push(i);
    }
    return out;
}
exports.fromTo = fromTo;
function charRange(begin, end) {
    return fromTo(begin.charCodeAt(0), end.charCodeAt(0)).map(function (x) { return String.fromCharCode(x); });
}
exports.charRange = charRange;
function record_create(xs) {
    var out = {};
    xs.forEach(function (x) { return (out[x.k] = x.v); });
    return out;
}
exports.record_create = record_create;
function record_forEach(x, k) {
    ;
    Object.keys(x).forEach(function (id) { return k(x[id], id); });
}
exports.record_forEach = record_forEach;
function record_traverse(x, k, sort_keys) {
    if (sort_keys === void 0) { sort_keys = false; }
    var ks = Object.keys(x);
    if (sort_keys) {
        ks.sort();
    }
    return ks.map(function (id) { return k(x[id], id); });
}
exports.record_traverse = record_traverse;
function record_map(x, k) {
    var out = {};
    record_forEach(x, function (a, id) { return (out[id] = k(a, id)); });
    return out;
}
exports.record_map = record_map;
function deepEquals(x, y) {
    if (x === y || x === null || y === null) {
        return x === y;
    }
    else if (Array.isArray(x) || Array.isArray(y)) {
        return (Array.isArray(x) &&
            Array.isArray(y) &&
            x.length == y.length &&
            x.every(function (e, i) { return deepEquals(e, y[i]); }));
    }
    else if (typeof x === 'object' && typeof y === 'object') {
        var xk = Object.keys(x).sort();
        var yk = Object.keys(y).sort();
        return deepEquals(xk, yk) && xk.every(function (k) { return deepEquals(x[k], y[k]); });
    }
    else {
        return false;
    }
}
exports.deepEquals = deepEquals;
function size(x) {
    if (x === null || typeof x !== 'object') {
        return 1;
    }
    else if (Array.isArray(x)) {
        return x.reduce(function (p, n) { return p + size(n); }, 1);
    }
    else {
        return size(Object.keys(x).map(function (k) { return x[k]; }));
    }
}
exports.size = size;
var leftpad = function (i, s) {
    return range(i - s.length)
        .map(function (_) { return ' '; })
        .join('') + s;
};
exports.pct = function (i) { return leftpad(3, '' + Math.round(i)) + '%'; };
function succ(x, s) {
    return (x[s] = (x[s] || (x[s] = 0)) + 1);
}
exports.succ = succ;
exports.serialize = function (s) { return (typeof s == 'string' ? s : JSON.stringify(s)); };
var stringify = require('json-stringify-pretty-compact');
/** Show a JSON object with indentation */
function show(x) {
    return stringify(x);
    // return JSON.stringify(x, undefined, 2)
}
exports.show = show;
//# sourceMappingURL=Utils.js.map