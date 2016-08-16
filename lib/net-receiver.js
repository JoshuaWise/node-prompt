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
	
	// option to allow multiple clients
	net.createServer(function (socket) {
		
	}).listen(8000, function () {
		console.log('node-prompt is listening for incoming connections.');
		// show host and port
	});
}
Object.setPrototypeOf(NetReceiver.prototype, Receiver.prototype);
module.exports = NetReceiver;
