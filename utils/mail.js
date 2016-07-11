'use strict';
const _ = require('underscore'),
  mailer = require('nodemailer'),
  tpl = require('./mail-template');
  
// create reusable transporter object using the default SMTP transport 
const transporter = mailer.createTransport(process.env.MAIL_URL);

// setup e-mail data with unicode symbols 
let mailOptions = {
  from: '"Bitunnel Team 👥" <no-reply@bitunnel.io>', // sender address 
  subject: 'Bitunnel Error Notification ✔', // Subject line 
  text: 'Please, reopen on a browser that supports html. Thanks', // plaintext body
};

exports.sendMail = (users, message) => {
  return new Promise((res, rej) => {
    let userMails = _.map(users, user => {
      return user.email;
    })
    userMails = userMails.toString();

    mailOptions = _.extend(mailOptions, { to: userMails });
    mailOptions = _.extend(mailOptions, { html: tpl.mailTemplate(message) });

    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        rej(error);
      }
      res(info);
    });
  });
}
