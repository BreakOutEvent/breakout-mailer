var express = require('express');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var app = express();
var mailer = require('./mailer');

app.use(morgan('combined'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.get('/', function (req, res) {
    res.send('Breakout Mailer Backend');
});

app.post('/webhook', mailer.webhook);
app.post('/send', mailer.sendMail);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});