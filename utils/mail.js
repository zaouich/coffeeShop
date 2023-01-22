const nodemailer = require("nodemailer");
const sendMail = (ops) => {
	var transport = "";
	if (process.env.NODE_ENV === "deve") {
		transport = nodemailer.createTransport({
			host: process.env.HOST,
			port: process.env.PORT,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});
	} else {
		transport = nodemailer.createTransport(
			new sendinblue({
				apiKey: process.env.SENDINBLUEAPI,
			})
		);
	}

	var options = {
		from: "bader zaouich",
		to: ops.to,
		subject: ops.subject,
		text: ops.text,
	};
	transport.sendMail(options);
};

module.exports = sendMail;
