'use strict';

exports.RUN_LINE = Symbol();
exports.END_OF_INPUT = Symbol();

exports.forEachPair = function (obj, fn, thisValue) {
	Object.keys(obj).forEach(function (key) {
		fn.call(thisValue, key, obj[key]);
	});
};
