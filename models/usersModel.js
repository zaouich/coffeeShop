const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "why no user name ?"],
		minlength: [4, "the users name sould be more than 4"],
		unique: true,
	},
	email: {
		type: String,
		required: [true, "why no email ?"],
		unique: true,
		validate: [validator.isEmail, "please provide a valid email adress"],
	},
	phone: {
		type: String,
		required: [true, "why no phone number ?"],
		unique: true,
		validate: [validator.isMobilePhone, "please provide a valid phone number"],
	},
	role: {
		type: String,
		default: "customer",
	},
	password: {
		type: String,
		required: [true, "why no passord ?"],
	},
	confirmPassword: {
		type: String,
		required: [true, "why you did not confirm your passord ?"],
		validate: {
			validator: function (val) {
				return this.password === val;
			},
			message: "the passwords are not the same",
		},
	},
	active: {
		type: Boolean,
		default: true,
	},
	changedAt: {
		type: Date,
	},
	resetToken: {
		type: String,
	},
	resetTokenExpires: {
		type: Date,
	},
});
userSchema.pre(/^find/, function () {
	this.find({ active: true });
});
userSchema.pre("save", async function (next) {
	if (!this.isNew) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	next();
});
userSchema.pre("save", async function (next) {
	if (this.isNew || !this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	this.changedAt = new Date();
	if (this.resetToken) {
		this.resetToken = undefined;
		this.resetTokenExpires = undefined;
	}

	next();
});
userSchema.methods.isCorrectPassword = async function (
	condidatPassword,
	password
) {
	return await bcrypt.compare(condidatPassword, password);
};
userSchema.methods.isChanged = async function (iat) {
	if (!this.changedAt) return false;
	return parseInt(this.changedAt.getTime() / 1000) > iat;
};
userSchema.methods.createResetToken = function () {
	const reset_token = crypto.randomBytes(32).toString("hex");
	const _reset_token = crypto
		.createHash("sha256")
		.update(reset_token)
		.digest("hex");
	this.resetToken = _reset_token;
	this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
	return reset_token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
