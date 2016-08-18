# node-prompt
`node-prompt` lets you control a node application directly from another computer, using a REPL interface.

## Usage
##### Getting started
```js
var prompt = require('node-prompt').stdin({prompt: '> '}); // Read from stdin

// *** OR ***

var prompt = require('node-prompt').net({ // Read from a network connection
    prompt: '> ',
    port: 43210,
    allowMultipleClients: false
});

// The above options are the defaults
```

##### Set up some commands
```js
prompt.command('getCurrentClients', function () {...});
prompt.command('doMyCustomAction', function () {...});
prompt.command('getUsageCPU', function () {...});
```

##### Or multiple commands at once
```js
prompt.command({
	getCurrentClients: function () {...},
	doMyCustomAction: function () {...},
	getUsageCPU: function () {...}
});
```

## Access the application
You can execute commands remotely by using the `node-prompt` CLI tool.

First, install the CLI tool:
```
sudo npm install -g node-prompt
```

Then connect to your node application, and start typing commands!
```
node-prompt myapplication.com:9000
> getUsageCPU
CPU usage at 2%
> doMyCustomAction 45 "this is a single argument"
You did a custom action with 2 arguments!
```

## Synchronous and asynchronous return values
For synchronous commands, you can send back a response message by returning a string. If an error is thrown, that error message will be sent back as the response.

You can only send response messages that are strings. If any other type of data is returned, an empty string is used instead.

There are two ways to have asynchronous commands...

#### Callbacks
If the first argument of the handler is named `$callback`, a node-style callback function will be passed as that argument. All other arguments will come after.

```js
prompt.command('getUsername', function ($callback, emailAddress) {
    getUsername(emailAddress, $callback);
});
```

#### Promises
If the handler returns a promise (or promise-like object), its fulfillment value or rejection reason will be used as the response message.

```js
prompt.command('getUsername', function (emailAddress) {
    return getUsername(emailAddress);
});
```
