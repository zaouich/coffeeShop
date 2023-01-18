const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const checkLogin = catchAsync(async (req, res, next) => {
	// check if the jwt is exicts
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	)
		return next(new AppError(401, "please login first"));
	// check if the jwt  is valid
	const token = req.headers.authorization.split(" ")[1];
	const verified = jwt.verify(
		req.headers.authorization.split(" ")[1],
		process.env.JWT
	); // rise an error
	// check if the user still exicts
	const user = await User.findOne({ _id: verified.id });
	if (!user) return next(new AppError(400, "this user no longer exicts"));
	// chekc if the users doesnt change his password after it sent
	if (await user.isChanged(verified.iat))
		return next(new AppError(400, "the user has been changed his password"));
	req.user = user;
	next();
});
const restrictTo = (...roles) => {
	return async (req, res, next) => {
		const user = await User.findById(req.user._id);
		if (!roles.includes(user.role))
			return next(new AppError(400, "you cant do this"));
		next();
	};
};
module.exports = { checkLogin, restrictTo };
