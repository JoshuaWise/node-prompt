'use strict';
var EventEmitter = require('events');

function LineReader(readableStream) {
	EventEmitter.call(this);
	
	function emitLine(line) {
		this.emit('line', line);
	}
	
	var bufferedText = '';
	readableStream.on('data', (chunk) => {
		bufferedText += chunk.toString();
		var lines = bufferedText.split('\n');
		bufferedText = lines.pop();
		lines.forEach(emitLine, this);
	});
	readableStream.on('end', () => {
		this.emit('end');
	});
}
Object.setPrototypeOf(LineReader.prototype, EventEmitter.prototype);
module.exports = LineReader;
