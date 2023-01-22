const Product = require("../models/productsModel");
const Review = require("../models/reviewsModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
// CHECK product
const checkProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.productId);
	if (!product) return next(new AppError(400, "no product found by this id"));
	next();
});
// check if you have a review on that product
const checkReview = async (req, res, next) => {
	const product = await Review.findOne({
		product: req.params.productId,
		user: req.user._id,
	});
	if (!product)
		return next(new AppError(400, "you have no review on that post"));
	next();
};
// add reviews
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
	const body_ = { ...req.body };
	const allowed = ["text", "review"];
	Object.keys(body_).forEach((el) => {
		if (!allowed.includes(el)) delete body_[el];
	});
	await Review.findOneAndUpdate(
		{
			user: req.user._id,
			product: req.params.productId,
		},
		body_,
		{ new: true, runValidators: true }
	);
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
});
// vertual populate
// 1) users
// 2) products done

// get all reviews
const getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find({});
	res.status(200).json({
		status: "success",
		reviews,
	});
});
// get one review
const getOneReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.reviewId);
	res.status(200).json({
		status: "success",
		review,
	});
});

module.exports = {
	addReview,
	checkReview,
	checkProduct,
	deleteReview,
	updateReview,
	getAllReviews,
	getOneReview,
};
