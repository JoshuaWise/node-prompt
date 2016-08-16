'use strict';
const util = require('./util');
const EVENTS = Symbol();

function Receiver() {
	this[EVENTS] = Object.create(null);
}
Receiver.prototype.command = function (name, fn) {
	if (name && typeof name === 'object') {
		util.forEachPair(name, Receiver.prototype.command, this);
		return this;
	}
	if (typeof fn !== 'function') {
		throw new TypeError('Expected command handler to be a function');
	}
	if (this[EVENTS][name]) {
		throw new TypeError('The ' + name + ' command has already been added');
	}
	this[EVENTS][name] = fn;
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
	var regex = /"[^"]*"|'[^']*'|\S+/g, arg;
	var args = [];
	while (arg = regex.exec(line)) {
		args.push(arg[0].trim().replace(/^"([^"]*)"$|^'([^']*)'$/, '$1$2'));
	}
	var command = args.shift();
	var fn = this[EVENTS][command];
	if (fn) {
		fn(...args);
	} else {
		throw new TypeError('Command not found: "' + command + '"');
	}
};
module.exports = Receiver;
