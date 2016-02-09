'use strict';

var mongoose = require('mongoose');

const MONGO_USER = process.env.MONGO_USER || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "mails";
const MONGO_HOST = process.env.MONGO_HOST || "127.0.0.1:27017";
const URL = buildMongoUrl(MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE, MONGO_HOST);

// Build connection URL dependent on whether a user is specified or not
function buildMongoUrl(user, password, database, host) {
  if(!user) {
    return `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`;
  } else {
    return `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`;
  }
}

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
