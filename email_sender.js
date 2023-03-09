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

module.exports.SendEmail = async function(email) {
    var mailOptions = {
        from: 'Abobka',
        to: email,
        subject: 'Thanks for registration !',
        html: '<a href="https://www.youtube.com/watch?v=ZK1pNGmNBEc">*Button*</a>'
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}