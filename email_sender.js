const nodemailer = require('nodemailer');
const config = require("./config");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  user: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: config.email_sender.user,
    pass: config.email_sender.pass
  }
});

module.exports.SendEmail = async function(email, id) {
    var mailOptions = {
        from: 'Abobka',
        to: email,
        subject: 'Confirm your registration',
        html: `<h3>Your family id is </h3><h2>${id}</h2><h3>.</h3>`
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}