'use strict';
const Receiver = require('./receiver');
const util = require('./util');

function StdinReceiver() {
	if (new.target !== StdinReceiver) {
		return new StdinReceiver;
	}
	Receiver.call(this);
}
Object.setPrototypeOf(StdinReceiver.prototype, Receiver.prototype);
module.exports = StdinReceiver;
