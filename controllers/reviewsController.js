const Product = require("../models/productsModel");
const Review = require("../models/reviewsModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const checkProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.productId);
	if (!product) return next(new AppError(400, "no product found by this id"));
	next();
};

const checkReview = async (req, res, next) => {
	const product = await Review.findOne({
		product: req.params.productId,
		user: req.user._id,
	});
	if (!product)
		return next(new AppError(400, "you have no review on that post"));
	next();
};
const addReview = catchAsync(async (req, res, next) => {
	const { text, review } = req.body;
	console.log(req.params.productId);
	const Newreview = await Review.create({
		text,
		review,
		product: req.params.productId,
		user: req.user._id,
	});
	res.status(200).json({
		status: "success",
		review: Newreview,
	});
});
// delete your review
const deleteReview = catchAsync(async (req, res, next) => {
	await Review.findOneAndDelete({
		user: req.user._id,
		product: req.params.productId,
	});
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
});
// update your review
const updateReview = catchAsync(async (req, res, next) => {
	await Review.findOneAndUpdate({
		user: req.user._id,
		product: req.params.productId,
	});
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
});
module.exports = { addReview, checkReview, checkProduct, deleteReview };
