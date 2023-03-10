import * as nodemailer from 'nodemailer';
import { DomainError } from './errors';

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
		html: `<div style="display:flex;align-items: flex-end;"><h3>Your family id is </h3><h2>${code}</h2><h3>.</h3></div>`,
		headers: { 'x-myheader': 'test header' }
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			throw new DomainError("Wrong Email");
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}