'use strict';
const net = require('net');
const Receiver = require('./receiver');
const LineReader = require('./line-reader');
const util = require('./util');

function NetReceiver(options = {}) {
	if (new.target !== NetReceiver) {
		return new NetReceiver(options);
	}
	Receiver.call(this);
	
	
	var {port = 43210, allowMultipleClients = false, prompt} = options;
	var hasClient = false;
	prompt = typeof prompt === 'string' ? prompt : '> ';
	
	
	net.createServer((socket) => {
		if (!allowMultipleClients && hasClient) {
			onEnd(socket, true)();
			return;
		}
		
		hasClient = true;
		socket.setKeepAlive(true, 50 * 1000);
		socket.setTimeout(180 * 1000);
		var endHandler = onEnd(socket, false);
		socket.on('timeout', endHandler);
		socket.on('end', endHandler);
		new LineReader(socket).on('line', (line) => {
			this[util.RUN_LINE](line).then(onFulfilled, onRejected)
		});
		
		var onFulfilled = (value) => {
			if (!socket.writable) {return;}
			if (typeof value !== 'string') {value = '';}
			socket.write(stringToBufferMessage(0, value));
		};
		
		var onRejected = (reason) => {
			if (!socket.writable) {return;}
			reason = String(reason);
			socket.write(stringToBufferMessage(1, reason));
		};
		
		socket.write(stringToBufferMessage(2, prompt));
		
	}).listen(+port, () => {
		console.log('[node-prompt is waiting for clients on port %s]', +port);
	});
	
	function onEnd(socket, deniedConnection) {
		var invoked = false;
		return function () {
			if (!invoked) {
				invoked = true;
				socket.end();
				if (!deniedConnection) {
					hasClient = false;
				}
				setTimeout(function () {
					socket.destroyed || socket.destroy();
					socket.removeAllListeners();
				}, 20 * 1000);
			}
		};
	}
}
Object.setPrototypeOf(NetReceiver.prototype, Receiver.prototype);
module.exports = NetReceiver;

function stringToBufferMessage(controlCode, string) {
	var buffer2 = Buffer.from(string);
	var buffer1 = Buffer.allocUnsafe(5);
	buffer1.writeUInt8(controlCode, 0);
	buffer1.writeUInt32BE(buffer2.length, 1);
	return Buffer.concat([buffer1, buffer2]);
}
