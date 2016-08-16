'use strict';

exports.RUN_LINE = Symbol();
exports.END_OF_INPUT = Symbol();

exports.forEachPair = function (obj, fn, thisValue) {
	Object.keys(obj)
	.map(keyToPair, obj)
	.map(pairWithThis, thisValue)
	.forEach(Function.prototype.apply, fn);
};

function pairWithThis(array) {
	return [this, array];
}

function keyToPair(key) {
	return [key, this[key]];
}