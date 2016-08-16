'use strict';
const clc = require('cli-color');
const Receiver = require('./receiver');
const LineReader = require('./line-reader');
const util = require('./util');
var instantiated = false;

function StdinReceiver(options = {}) {
	if (instantiated) {
		throw new TypeError('Only one stdin receiver may be created for a given process');
	}
	if (new.target !== StdinReceiver) {
		return new StdinReceiver(options);
	}
	Receiver.call(this);
	
	
	var waiting = false;
	var lineQueue = [];
	
	var flush = () => {
		if (!waiting && lineQueue.length) {
			waiting = true;
			var line = lineQueue.shift();
			line != null ? this[util.RUN_LINE](line).then(onFulfilled, onRejected)
			             : onEnd();
			return true;
		}
		return false;
	};
	
	var onFulfilled = (value) => {
		if (typeof value === 'string') {
			process.stdout.write(value + '\n');
		}
		onFinally();
	};
	
	var onRejected = (reason) => {
		process.stdout.write(clc.red(String(reason)) + '\n');
		onFinally();
	};
	
	var onFinally = () => {
		waiting = false;
		flush() || stdin.prompt();
	};
	
	var onEnd = () => {
		this.removeAllCommands();
		this[util.END_OF_INPUT] = true;
		process.stdout.write('\n' + clc.blue('[END OF INPUT]') + '\n');
	};
	
	// Read from stdin, line by line
	var stdin = new LineReader(typeof options.prompt === 'string' ? options.prompt : '> ');
	var handleData = (data) => {
		lineQueue.push(data);
		flush();
	};
	stdin.on('line', handleData);
	stdin.on('end', handleData);
	
	// Mark as instantiated, to prevent multiple instances from being created
	instantiated = true;
}
Object.setPrototypeOf(StdinReceiver.prototype, Receiver.prototype);
module.exports = StdinReceiver;
