"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../dist/index");
const assert = require("assert");
function logWithArgs(f, ...args) {
    console.log(args, ' => ', f(...args));
}
const testRandomizer = index_1.randomizer('test');
assert.equal(17.57185, testRandomizer.randomFloat(1, 20, 5, true), 'testRandomizer does not return expected random number');
assert.equal(12.609, testRandomizer.randomFloat(11, 15, 3, true), 'testRandomizer does not return expected random number');
assert.equal(7.86, testRandomizer.randomFloat(4, 8, 2, true), 'testRandomizer does not return expected random number');
logWithArgs(testRandomizer.randomFloatSet, 10, 2, 20, 3, true);
logWithArgs(testRandomizer.shakeSet, 10, 2, 20, 3, 10, .5, true);
logWithArgs(testRandomizer.randomInt, 4, 4, false);
const poly0 = index_1.quadraticFromPoints([0, 0], [2, 3], [6, 4]);
logWithArgs(poly0, 4);
logWithArgs(poly0, 5);
const poly1 = index_1.quadraticFromPoints([-3, -1], [-1, 1], [1, -1]);
logWithArgs(poly1, 0);
logWithArgs(poly1, -2);
const line = index_1.linearFromPoints([0, 1], [10, 11]);
logWithArgs(line, 4);
logWithArgs(line, 6);
