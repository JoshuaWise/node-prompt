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
			this[util.RUN_LINE](lineQueue.shift()).then(onFulfilled, onRejected);
		}
	};
	
	var onFulfilled = (value) => {
		if (typeof value === 'string') {
			process.stdout.write(value + '\n');
		}
		waiting = false;
		flush();
	};
	
	var onRejected = (reason) => {
		process.stdout.write(clc.red(String(reason)) + '\n');
		waiting = false;
		flush();
	};
	
	// Read from stdin, line by line
	var stdin = new LineReader(typeof options.prompt === 'string' ? options.prompt : '> ');
	stdin.on('line', (line) => {
		lineQueue.push(line);
		flush();
	});
	stdin.on('end', () => {
		this.removeAllCommands();
		this[util.END_OF_INPUT] = true;
		process.stdout.write('\n' + clc.blue('[END OF INPUT]') + '\n');
	});
	
	// Mark as instantiated, to prevent multiple instances from being created
	instantiated = true;
}
Object.setPrototypeOf(StdinReceiver.prototype, Receiver.prototype);
module.exports = StdinReceiver;
