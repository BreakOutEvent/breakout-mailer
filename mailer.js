var sendgrid = require('sendgrid')(process.env.SENDGRID_KEY);
var uuid = require('node-uuid');
var mongo = require('./mongoose.js');


var mailObject = mongo.mongoose.model('mails',
    mongo.mongoose.Schema({
        id: String,
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
        if (elem.mailer_id != null) {
            mailObject.findOne({id: elem.mailer_id}, function (error, obj) {
                if (obj != null) {
                    console.log(req.body);

                    obj.tos.forEach(function (to) {
                        if (to.email == elem.email) {
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

    if (mail.tos != null) {
        mail.tos.forEach(function (elem) {
            email.addTo(elem);
            to.push({email: elem, isbcc: false, events: []});
        });
    }

    if (mail.bccs != null) {
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

    if (mail.files != null) {
        mail.files.forEach(function (elem) {
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

module.exports = {
    webhook: webhook,
    sendMail: sendMail
};