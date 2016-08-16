'use strict';
const Promise = require('bluebird');
const isPromise = require('is-promise');
const util = require('./util');
const EVENTS = Symbol();

function Receiver() {
	this[EVENTS] = Object.create(null);
	this[util.END_OF_INPUT] = false;
}
Receiver.prototype.command = function (name, fn) {
	if (name && typeof name === 'object') {
		util.forEachPair(name, Receiver.prototype.command, this);
		return this;
	}
	if (typeof fn !== 'function') {
		throw new TypeError('Expected command handler to be a function');
	}
	if (!this[util.END_OF_INPUT]) {
		if (this[EVENTS][name]) {
			throw new TypeError('The ' + name + ' command has already been added');
		}
		this[EVENTS][name] = fn;
	}
	return this;
};
Receiver.prototype.removeCommand = function (name) {
	delete this[EVENTS][name];
	return this;
};
Receiver.prototype.removeAllCommands = function () {
	this[EVENTS] = Object.create(null);
	return this;
};
Receiver.prototype[util.RUN_LINE] = function (line) {
	line = String(line).trim();
	var regex = /"[^"]*"|'[^']*'|\S+/g;
	var args = [];
	var arg;
	while (arg = regex.exec(line)) {
		args.push(arg[0].trim().replace(/^"([^"]*)"$|^'([^']*)'$/, '$1$2'));
	}
	return runLine.call(this, args.shift(), args);
};
module.exports = Receiver;

var runLine = Promise.promisify(function (command, args, callback) {
	var fn = this[EVENTS][command];
	if (!fn) {
		throw new TypeError('Command not found: "' + command + '"');
	}
	if (/^(function(\(|\s+[^(]*\()|\()\s*\$callback/.test(fn.toString())) {
		fn(callback, ...args);
	} else {
		var ret = fn(...args);
		if (isPromise(ret)) {
			ret.then(function (value) {callback(null, value);}, callback);
		} else {
			callback(null, ret);
		}
	}
});
