var net = require('../../browser');

var socket = net.connect({
	host: 'google.com',
	port: 80
});

socket.on('error', function (err) {
	console.error(err);
});

socket.on('connect', function () {
	console.log('Connected!');
});

socket.on('data', function (buffer) {
	document.getElementById('output').innerHTML += buffer.toString();
});

socket.on('end', function () {
	console.log('Socket closed.');
});

var ending = '\r\n';

var reqStr = 'GET /'+ending+'Host: google.com'+ending+ending;
document.getElementById('input').innerHTML = reqStr;

socket.write(reqStr);