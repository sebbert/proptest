"use strict";
exports.__esModule = true;
function thunk(expr) {
    return { expr: expr, memorized: undefined };
}
function force(thunk) {
    if (thunk.expr !== undefined) {
        thunk.memorized = thunk.expr();
        thunk.expr = undefined;
    }
    return thunk.memorized;
}
exports.force = force;
exports.nil = thunk(function () { return undefined; });
function cons(head, tail) {
    return thunk(function () { return ({ head: head, tail: tail }); });
}
exports.cons = cons;
function map(f, l) {
    return thunk(function () {
        var as = force(l);
        return as ? { head: f(as.head), tail: map(f, as.tail) } : undefined;
    });
}
exports.map = map;
function concat(l1, l2) {
    return thunk(function () {
        var as = force(l1);
        return as ? { head: as.head, tail: concat(as.tail, l2) } : force(l2);
    });
}
exports.concat = concat;
function flatten(ls) {
    return thunk(function () {
        var as = force(ls);
        return as ? force(concat(as.head, flatten(as.tail))) : undefined;
    });
}
exports.flatten = flatten;
function iterate(init, loop) {
    return thunk(function () {
        return { head: init, tail: iterate(loop(init), loop) };
    });
}
exports.iterate = iterate;
function takeWhile(p, ls) {
    return thunk(function () {
        var as = force(ls);
        return as && p(as.head) ? { head: as.head, tail: takeWhile(p, as.tail) } : undefined;
    });
}
exports.takeWhile = takeWhile;
function fromArray(arr) {
    function go(idx, arr) {
        return thunk(function () { return (idx === arr.length ? undefined : { head: arr[idx], tail: go(idx + 1, arr) }); });
    }
    return go(0, arr);
}
exports.fromArray = fromArray;
function toArray(l) {
    var out = [];
    var child = force(l);
    while (child !== undefined) {
        out.push(child.head);
        child = force(child.tail);
    }
    return out;
}
exports.toArray = toArray;
//# sourceMappingURL=lazylist.js.map