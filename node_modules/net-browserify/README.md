net-browserify
==============

`net` module for browserify, with a websocket server proxy.

Supported methods:
* `net.connect(options, cb)`
* `net.isIP(input)`, `net.isIPv4(input)`, `net.isIPv6(input)`

Examples are available in `examples/`.

How to use
----------

### For the client

Just require this module or map this module to the `net` module with [Browserify](https://github.com/substack/node-browserify).
```
$ npm install net-browserify
```

You can set a custom proxy address if you want to:
```js
var net = require('net');

// Optionaly, set a custom proxy address
// (defaults to the current host & port)
net.setProxy({
	hostname: 'example.org',
	port: 42
});

// Use the net module like on a server
var socket = net.connect({
	host: 'google.com',
	port: 80
});

socket.on('connect', function () {
	console.log('Connected to google.com!');
});
```

### For the server

```js
var express = require('express');
var netApi = require('net-browserify');

// Create our app
var app = express();

app.use(netApi());

// Start the server
var server = app.listen(3000, function() {
	console.log('Server listening on port ' + server.address().port);
});
```

You can also specify some options:
```js
app.use(netApi({
	allowOrigin: '*', // Allow access from any origin
	to: [ // Restrict destination
		{ host: 'example.org', port: 42 }, // Restrict to example.org:42
		{ host: 'example.org' }, // Restrict to example.org, allow any port
		{ port: 42 }, // Restrict to port 42 only, allow any host
		{ host: 'bad.com', blacklist: true } // Blacklist bad.com
		// And so on...
	]
}));
```

License
-------

The MIT license.
