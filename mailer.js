'use strict';

var sendgrid = require('sendgrid')(process.env.MAILER_SENDGRID_KEY);
var uuid = require('node-uuid');
var mongo = require('./mongoose.js');

var mailObject = mongo.mongoose.model('mails',
    mongo.mongoose.Schema({
        id: String,
        campaign_code: String,
        tos: [{email: String, isbcc: Boolean, events: [{timestamp: Number, message: String, email: String}]}],
        subject: String,
        body: String,
        from: String,
        attachments: [String],
        create_date: Number,
        update_date: Number
    })
);


var getTimestamp = function () {
    return parseInt(new Date().getTime() / 1000);
};

var webhook = function (req, res, next) {
    console.log(req.body);
    req.body.forEach(function (elem) {
        if (elem.mailer_id !== undefined) {
            mailObject.findOne({id: elem.mailer_id}, function (error, obj) {
                if (obj !== undefined) {
                    console.log(req.body);

                    obj.tos.forEach(function (to) {
                        if (to.email === elem.email) {
                            to.events.push({timestamp: elem.timestamp, message: elem.event});
                        }
                    });
                    obj.update_date = elem.timestamp;
                    obj.save(function (err) {
                        if (err) console.error(err);
                    });
                } else {
                    console.log(error);
                }
            });
        }
    });

    res.json({success: true});
};

var sendMail = function (req, res, next) {
    var mail = req.body;

    //Timestamp - 2 to fix async time issues
    var start_date = getTimestamp() - 2;

    var email = new sendgrid.Email();

    var to = [];

    if (mail.tos !== undefined) {
        mail.tos.forEach(function (elem) {
            email.addTo(elem);
            to.push({email: elem, isbcc: false, events: []});
        });
    }

    if (mail.bccs !== undefined) {
        mail.bccs.forEach(function (elem) {
            console.log(elem);
            email.addBcc(elem);
            to.push({email: elem, isbcc: true, events: []});
        });
    }

    email.setSubject(mail.subject);
    email.setHtml(mail.html);
    email.setFrom("mailer@break-out.org");
    email.setFromName("Breakout Mailer");

    if (mail.files !== undefined) {
        mail.files.forEach(function (elem) {
            //TODO download/upload Files
            email.addFile(elem);
        });
    }

    var id = uuid.v4();
    email.addUniqueArg("mailer_id", id);

    var status = "creating";
    var error = "";

    sendgrid.send(email, function (err, json) {
        var mongomail = new mailObject({
            id: id,
            tos: to,
            subject: mail.subject,
            campaign_code: mail.campaign_code,
            body: mail.html,
            attachments: mail.files,
            create_date: start_date,
            update_date: start_date
        });

        if (err) {
            status = "error: " + err;
            console.error(err);
            res.json({error: err});
        } else {
            if (json.message === 'success') {
                status = "started";
                console.log("Sent " + mail.subject + "-Mail to: " + JSON.stringify(mail.tos));
                res.json({success: 'ok', mailer_id: id});
            } else {
                status = json.message;
                console.error(json);
                res.json({error: json});
            }
        }

        mongomail.tos.forEach(function (elem) {
            elem.events.push({timestamp: start_date, message: status});
        });

        mongomail.save(function (err, mongomail) {
            if (err) console.error(err);
        });
    });


};

var getByID = function (req, res) {
    if (req.params.id) {
        mailObject.findOne({id: req.params.id}, function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        });
    }
};

var getFromTo = function (req, res) {
    if (req.params.to && req.params.from) {
        mailObject.find({
            $or: [{
                create_date: {
                    $lte: req.params.to,
                    $gte: req.params.from
                }
            }, {
                update_date: {
                    $lte: req.params.to,
                    $gte: req.params.from
                }
            }]
        }).sort({update_date: 'desc'}).exec(function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        });
    }
};

var getByCampaign = function (req, res) {
    if (req.params.campaign_code) {
        mailObject.find({
            campaign_code: req.params.campaign_code
        }).sort({update_date: 'desc'}).exec(function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        });
    }
};

var getWithError = function (req, res) {
    mailObject.find(
        {"tos.events.message": {"$in": ["deferred", "dropped", "bounce"]}}
    ).sort({update_date: 'desc'}).exec(function (err, data) {
        if (err) return console.error(err);
        res.json(data);
    });

};

var getAll = function (req, res) {
    mailObject.find({}).sort({update_date: 'desc'}).exec(function (err, data) {
        if (err) return console.error(err);
        res.json(data);
    });

};

var getForReceiver = function (req, res) {
    if (req.params.email) {
        mailObject.find(
            {"tos.email": req.params.email}
        ).sort({update_date: 'desc'}).exec(function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        });
    }
};


module.exports = {
    webhook: webhook,
    sendMail: sendMail,
    getByID: getByID,
    getFromTo: getFromTo,
    getByCampaign: getByCampaign,
    getWithError: getWithError,
    getAll: getAll,
    getForReceiver: getForReceiver
};
