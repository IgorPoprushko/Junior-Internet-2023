import * as nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	requireTLS: true,
	auth: {
		user: process.env.EMAIL_SENDER_USER,
		pass: process.env.EMAIL_SENDER_PASS,
	},
	logger: true
});

export function SendEmail(email: string, code: string) {
	var mailOptions = {
		from: 'OUR_APPLICATION',
		to: email,
		subject: 'Confirm your registration',
		html: `<h3>Your family id is </h3><h2>${code}</h2><h3>.</h3>`,
		headers: { 'x-myheader': 'test header' }
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}