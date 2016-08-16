'use strict';
const clc = require('cli-color');
const Receiver = require('./receiver');
const util = require('./util');

function StdinReceiver(options = {}) {
	if (new.target !== StdinReceiver) {
		return new StdinReceiver(options);
	}
	Receiver.call(this);
	
	var prompt = typeof options.prompt === 'string' ? options.prompt : '';
	var bufferedText = '';
	
	process.stdin.on('data', (chunk) => {
		bufferedText += chunk.toString();
		var lines = bufferedText.split('\n');
		bufferedText = lines.pop();
		lines.forEach(runLine, this);
		lines.length && process.stdout.write(prompt);
	});
	process.stdin.on('end', () => {
		this.removeAllCommands();
		this[util.END_OF_INPUT] = true;
		process.stdout.write(clc.blue('\n[END OF INPUT]') + '\n');
	});
	process.stdout.write(prompt);
}
Object.setPrototypeOf(StdinReceiver.prototype, Receiver.prototype);
module.exports = StdinReceiver;

function runLine(line) {
	try {
		this[util.RUN_LINE](line);
	} catch (ex) {
		process.stdout.write(clc.red(String(ex)) + '\n');
	}
}
