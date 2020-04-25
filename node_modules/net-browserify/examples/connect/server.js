var express = require('express');
var netApi = require('../../api');

var app = express();

app.use(netApi());

app.use(express.static(__dirname));

app.listen(3000, function() {
	console.log('Server listening on port 3000');
});