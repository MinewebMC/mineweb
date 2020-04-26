var express = require('express');
var netApi = require('net-browserify');
var bodyParser = require('body-parser');
var request = require('request');

// Create our app
var app = express();

app.use(netApi());
app.use(express.static('./'))

app.use(bodyParser.json({limit: "100kb"}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(404, { error: '404 Not Found' });
            return;
        }
        newHeaders = req.headers;
        newHeaders.host = targetURL.replace("https://", "").replace("http://", "").split("/")[0];
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: req.headers },
            function (error, response, body) {
                if (error) {
                    console.error(error);
                    console.error('error: ' + response.statusCode)
                }
//                console.log(body);
            }).pipe(res);
    }
});

// Start the server
var server = app.listen(8080, function() {
    console.log('Server listening on port ' + server.address().port);
});