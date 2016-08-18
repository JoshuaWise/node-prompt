'use strict';
const clc = require('cli-color');
const LineReader = require('../lib/line-reader');
const MessageReader = require('../lib/message-reader');

module.exports = function (socket) {
	var prompt;
	var waiting = false;
	var lineQueue = [];
	
	
	var flush = () => {
		if (!waiting && lineQueue.length) {
			waiting = true;
			var line = lineQueue.shift();
			line != null ? socket.write(line + '\n') : onEnd();
			return true;
		}
		return false;
	};
	
	var onEnd = () => {
		process.stdout.write('\n' + clc.blue('[END OF INPUT]') + '\n');
		socket.end();
	};
	
	
	// Receive respones from the remote application
	new MessageReader(socket)
		.on('message', function (controlCode, message) {
			if (controlCode === 2) {
				prompt = message;
				startPrompt();
				return;
			}
			else if (controlCode === 1) {
				var color = clc.red;
				message = message || '[ERROR]';
			}
			else if (controlCode === 0) {
				var color = clc.blue;
				message = message || '[COMPLETE]';
			}
			process.stdout.write(color(message) + '\n');
			waiting = false;
			flush() || process.stdout.write(prompt);
		})
		.on('end', function () {
			process.stdout.write('\n' + clc.blue('[DISCONNECTED]') + '\n');
			process.exit();
		});
	
	var startPrompt = () => {
		// Read from stdin, line by line
		var handleData = (data) => {
			lineQueue.push(data);
			flush();
		};
		new LineReader(process.stdin)
			.on('line', handleData)
			.on('end', handleData);
		
		// Write the first prompt
		process.stdout.write(prompt);
	};
};
