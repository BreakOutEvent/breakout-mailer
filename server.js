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

function auth(req, res, next) {
    if (req.get('X-AUTH-TOKEN') && (req.get('X-AUTH-TOKEN') == process.env.MAILER_AUTH_TOKEN)) {
        next();
    } else {
        res.status(401);
        res.json({error: "authentication required"});
    }
}

app.post('/webhook', auth, mailer.webhook);
app.post('/send', auth, mailer.sendMail);
app.get('/get/campaign/:campaign_code', auth, mailer.getByCampaign);
app.get('/get/error', auth, mailer.getWithError);
app.get('/get/to/:email', auth, mailer.getForReceiver);
app.get('/get/:id', auth, mailer.getByID);
app.get('/get/:from/:to', auth, mailer.getFromTo);
app.get('/get', auth, mailer.getAll);

var port = process.env.MAILER_PORT || 3003;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Mailservice listening at http://%s:%s', host, port);
});