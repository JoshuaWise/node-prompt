# node-prompt
`node-prompt` lets you control a node application directly from another computer, using a REPL interface.

## Usage
##### Create an instance of node-prompt
```js
// This lets you control the application via stdin
var np = require('node-prompt').stdin({prompt: '> '});

// This lets you control the application over a network
var np = require('node-prompt').net({
    prompt: '> ',
    port: 43210,
    allowMultipleClients: false
});
// The above options are the defaults
```

##### Set up commands
```js
np.command('getCurrentClients', function () {...});
np.command('doMyCustomAction', function () {...});
np.command('getUsageCPU', function () {...});
```

##### Or multiple commands at once
```js
np.command({
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




