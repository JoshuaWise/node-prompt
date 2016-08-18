# node-prompt
SSH lets you run applications (bash) on other computers. `node-prompt` lets you access a node application directly from another computer, using a bash-like interface.

## Usage
##### Locally
```js
var np = require('node-prompt').stdin({prompt: '> '});
```
##### Over a network
```js
var np = require('node-prompt').net({port: 9000});
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
	doMyCustomAction: function () {...}
	getUsageCPU: function () {...},
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

# API


