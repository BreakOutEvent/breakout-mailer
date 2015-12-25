'use strict';
var mongoose = require('mongoose');

const MAILER_MONGO_DB_HOST = process.env.MAILER_MONGO_DB_HOST || "127.0.0.1";
const MAILER_MONGO_DB_PORT = process.env.MAILER_MONGO_DB_PORT || "27017";
const URL = `mongodb://${MAILER_MONGO_DB_HOST}:${MAILER_MONGO_DB_PORT}`;

/**
 * Code in this File is taken from http://stackoverflow.com/a/33139673
 *
 * Created By: Gil SH (https://stackoverflow.com/users/880223/gil-sh)
 * License is cc by-sa 3.0
 */


var db = mongoose.connection;
var lastReconnectAttempt; //saves the timestamp of the last reconnect attempt

var opt = {
    // user: 'admin',
    // pass: 'pass',
    // auth: {
    //     authdb: 'admin'
    // },
    server: {auto_reconnect: true}
};

mongoose.connect(URL, opt);

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    var now = new Date().getTime();
    // check if the last reconnection attempt was too early
    if (lastReconnectAttempt && now - lastReconnectAttempt < 5000) {
        // if it does, delay the next attempt
        var delay = 5000 - (now - lastReconnectAttempt);
        console.log('reconnecting to MongoDB in ' + delay + "mills");
        setTimeout(function () {
            console.log('reconnecting to MongoDB');
            lastReconnectAttempt = new Date().getTime();
            mongoose.connect(URL, opt);
        }, delay);
    }
    else {
        console.log('reconnecting to MongoDB');
        lastReconnectAttempt = now;
        mongoose.connect(URL, opt);
    }
});

module.exports = {
    mongoose: mongoose
};
