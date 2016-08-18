'use strict';
var EventEmitter = require('events');

function MessageReader(socket) {
	EventEmitter.call(this);
	var listener1, listener2;
	
	var pendingChunks = [];
	var totalSize = 0;
	var completionSize = undefined;
	
	var digestChunks = () => {
		if (completionSize === undefined) {
			if (pendingChunks.length > 1) {
				pendingChunks = [Buffer.concat(pendingChunks)];
			}
			if (pendingChunks[0].length >= 5) {
				completionSize = pendingChunks[0].readUInt32BE(1) + 5;
			}
		}
		if (totalSize >= completionSize) {
			var allData = Buffer.concat(pendingChunks);
			this.emit('message', !!allData.readUInt8(0), allData.slice(5, completionSize));
			allData = allData.slice(completionSize);
			
			pendingChunks = allData.length ? [allData] : [];
			totalSize -= completionSize;
			completionSize = undefined;
			totalSize >= 5 && digestChunks();
		}
	}
	
	socket.on('data', listener1 = (chunk) => {
		pendingChunks.push(chunk);
		totalSize += chunk.length;
		digestChunks();
	});
	socket.on('end', listener2 = () => {
		this.emit('end');
		socket.removeListener('data', listener1);
		socket.removeListener('end', listener2);
		this.removeAllListeners('message');
		this.removeAllListeners('end');
	});
}
Object.setPrototypeOf(MessageReader.prototype, EventEmitter.prototype);
module.exports = MessageReader;
