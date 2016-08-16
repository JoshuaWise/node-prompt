'use strict';
const net = require('net');
const Receiver = require('./receiver');
const util = require('./util');

function NetReceiver(options = {}) {
	if (new.target !== NetReceiver) {
		return new NetReceiver(options);
	}
	Receiver.call(this);
	
	
	
}
Object.setPrototypeOf(NetReceiver.prototype, Receiver.prototype);
module.exports = NetReceiver;
