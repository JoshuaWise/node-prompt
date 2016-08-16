'use strict';
var EventEmitter = require('events');

function LineReader(prompt) {
	EventEmitter.call(this);
	
	this.prompt = function () {
		process.stdout.write(prompt);
	};
	
	function emitLine(line) {
		this.emit('line', line);
	}
	
	var bufferedText = '';
	process.stdin.on('data', (chunk) => {
		bufferedText += chunk.toString();
		var lines = bufferedText.split('\n');
		bufferedText = lines.pop();
		lines.forEach(emitLine, this);
	});
	process.stdin.on('end', () => {
		this.emit('end');
	});
	
	this.prompt();
}
Object.setPrototypeOf(LineReader.prototype, EventEmitter.prototype);
module.exports = LineReader;
