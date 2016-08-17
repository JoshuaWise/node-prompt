'use strict';
var EventEmitter = require('events');

function LineReader(readableStream) {
	EventEmitter.call(this);
	var listener1, listener2;
	
	function emitLine(line) {
		this.emit('line', line);
	}
	
	var bufferedText = '';
	readableStream.on('data', listener1 = (chunk) => {
		bufferedText += chunk.toString();
		var lines = bufferedText.split('\n');
		bufferedText = lines.pop();
		lines.forEach(emitLine, this);
	});
	readableStream.on('end', listener2 = () => {
		this.emit('end');
		readableStream.removeListener('data', listener1);
		readableStream.removeListener('end', listener2);
		this.removeAllListeners('line');
		this.removeAllListeners('end');
	});
}
Object.setPrototypeOf(LineReader.prototype, EventEmitter.prototype);
module.exports = LineReader;
