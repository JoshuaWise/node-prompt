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

## Access the application using the node-prompt CLI tool
```
sudo npm install -g node-prompt
node-prompt myapplication.com:9000
```
```
> getUsageCPU
CPU usage at 2%
> doMyCustomAction 45 "this is a single argument"
You did a custom action with 2 arguments!
```




