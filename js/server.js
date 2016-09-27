var express = require('express'),
    app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    res.send('Hello World');
});

app.listen(8000);