const User = require("../models/usersModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/mail");
// token
const passport = async (user, res) => {
	const jwt_ = jwt.sign({ id: user._id }, process.env.JWT, {
		expiresIn: process.env.JWTEX,
	});
	res.cookie("jwt", jwt_, {
		expires: new Date(
			Date.now() + process.env.COOKIEEXPIRES * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: `${process.env.NODE_ENV === "deve"}` ? false : true,
	});
	res.status(200).json({
		status: "success",
		user,
		jwt_,
	});
};
// sign Up
const signUp = catchAsync(async (req, res, next) => {
	const { username, email, phone, password, confirmPassword } = req.body;
	const newUser = await User.create({
		username,
		email,
		phone,
		password,
		confirmPassword,
	});
	passport(newUser, res);
});
// login
const login = catchAsync(async (req, res, next) => {
	const { login, password } = req.body;
	if (!login || !password)
		return next(new AppError(400, "why on login or password ?"));
	const user = await User.findOne({
		$or: [{ email: login }, { phone: login }],
	});
	if (!user || !(await user.isCorrectPassword(password, user.password)))
		return next(new AppError(401, "why invalid login or password ?"));
	passport(user, res);
});
// update infos
const updateMe = catchAsync(async (req, res, next) => {
	const body_ = { ...req.body };
	const valid = ["email", "phone", "username"];
	Object.keys(body_).forEach((el) => {
		if (!valid.includes(el)) delete body_[el];
	});

	const user = req.user;
	const targetUser = await User.findByIdAndUpdate(user._id, body_, {
		new: true,
		runValidators: true,
	});
	res.status(201).json({
		status: "success",
		user: targetUser,
	});
});
// update password
const updateMyPassword = catchAsync(async (req, res, next) => {
	const { oldPassword, password, confirmPassword } = req.body;
	const user = await User.findOne({ _id: req.user._id });
	// check if the old password is axicts and true
	if (
		!oldPassword ||
		!(await user.isCorrectPassword(oldPassword, user.password))
	)
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	user.password = password;
	user.confirmPassword = confirmPassword;
	await user.save();
	passport(user, res);
});
// delete Me
const deleteMe = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	user.active = false;
	await user.save({ validateBeforeSave: false });
	res.status(204);
});
//forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
	const { login } = req.body;
	if (!login)
		return next(new AppError(400, "please provid your email or phone number"));
	const user = await User.findOne({
		$or: [{ email: login }, { phone: login }],
	});
	if (!user) return next(new AppError(400, "no user dound By this Id"));
	// create the reset token and the exipres
	const reset_token = await user.createResetToken();
	await user.save({ validateBeforeSave: false });
	// send email
	const link = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${reset_token}`;
	sendMail({
		to: user.email,
		subject: "expires in 10 min",
		text: link,
	});
	res.send("sent to your email ?");
});
// reset password
const resetPassword = catchAsync(async (req, res, next) => {
	const { password, confirmPassword } = req.body;
	const token_ = req.params.token;
	const _token = crypto.createHash("sha256").update(token_).digest("hex");
	// find the user depands on the token
	const user = await User.findOne({
		resetToken: _token,
		resetTokenExpires: { $gt: new Date() },
	});

	if (!user) return next(new AppError(400, "invalid or expired link"));
	//chenge password
	user.password = password;
	user.confirmPassword = confirmPassword;
	user.save({ runValidators: false });
	passport(user, res);
});
// get all users
const getAllUser = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	const users = await User.find();
	res.status(200).json({
		status: "success",
		data: {
			length: users.length,
			users,
		},
	});
};
// get one user
const getOneUser = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	const user_ = await User.findById(req.params.id);
	if (!user_) return next(new AppError(400, "no user found by this id"));
	res.status(200).json({
		status: "success",
		user_,
	});
};
// delete all users
const deleteAllUsers = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	await User.deleteMany();
	res.status(204).json({
		status: "succses",
		message: "deleted",
	});
};
// delete one user
const deleteOneUser = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
	await User.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: "succses",
		message: "deleted",
	});
};
module.exports = {
	signUp,
	login,
	updateMe,
	updateMyPassword,
	deleteMe,
	forgotPassword,
	resetPassword,
	getAllUser,
	getOneUser,
	deleteAllUsers,
	deleteOneUser,
};
