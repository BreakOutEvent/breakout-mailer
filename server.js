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
app.get('/get/campaign/:campaign_code', mailer.getByCampaign);
app.get('/get/error', mailer.getWithError);
app.get('/get/to/:email', mailer.getForReceiver);
app.get('/get/:id', mailer.getByID);
app.get('/get/:from/:to', mailer.getFromTo);
app.get('/get', mailer.getAll);


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Mailservice listening at http://%s:%s', host, port);
});