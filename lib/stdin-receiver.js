'use strict';
const Receiver = require('./receiver');
const util = require('./util');

function StdinReceiver() {
	if (new.target !== StdinReceiver) {
		return new StdinReceiver;
	}
	Receiver.call(this);
	
	var bufferedText = '';
	
	process.stdin.on('data', (chunk) => {
		bufferedText += chunk.toString();
		var lines = bufferedText.split('\n');
		bufferedText = lines.pop();
		lines.forEach(runLine, this);
	});
	process.stdin.on('end', () => {
		this.removeAllCommands();
		this[util.END_OF_INPUT] = true;
		console.log('[END OF INPUT]');
	});
}
Object.setPrototypeOf(StdinReceiver.prototype, Receiver.prototype);
module.exports = StdinReceiver;

function runLine(line) {
	try {
		this[util.RUN_LINE](line);
	} catch (ex) {
		console.log(String(ex));
	}
}
