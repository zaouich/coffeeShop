const nodemailer = require("nodemailer");
const sendMail = (ops) => {
	var transport = nodemailer.createTransport({
		host: process.env.HOST,
		port: process.env.PORT,
		auth: {
			user: process.env.USER,
			pass: process.env.PASS,
		},
	});
	var options = {
		from: "bader zaouich",
		to: ops.to,
		subject: ops.subject,
		text: ops.text,
	};
	transport.sendMail(options);
};

module.exports = sendMail;
