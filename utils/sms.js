const accountSid = "AC6c449db69d57941571115f72f029ae35";
const authToken = process.env.SMSAUTH;
const client = require("twilio")(accountSid, authToken);

const sendSms = () => {
	client.messages
		.create({
			body: "Hello from Node.js",
			from: "+13608417529",
			to: "+212637342771",
		})
		.then((message) => console.log(message.sid));
};
module.exports = sendSms;
