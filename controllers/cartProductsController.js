const CartProducts = require("../models/cartProducts");
const Product = require("../models/productsModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// productId
// add product to the cart
const addProductTotheCart = async (req, res, next) => {
	// check if the product exicts
	const product = await Product.findById(req.params.productId);
	if (!product)
		return next(new AppError(400, "there is no product by this id"));
	// check if the product exicts in the cart before
	const inTheCart = await CartProducts.findOne({
		product: req.params.productId,
	});
	if (inTheCart) {
		inTheCart.quantity = inTheCart.quantity + 1;
		await inTheCart.save();
		return res.status(200).json({
			status: "success",
			message: "added to the cart",
		});
	}
	await CartProducts.create({
		product: req.params.productId,
		user: req.user._id,
	});
	return res.status(200).json({
		status: "success",
		message: "added to the cart",
	});
};

// delete one item from a selected product
const deleteOneItem = async (req, res, next) => {
	// check if the product exicts in the cart
	const product = await CartProducts.findOne({
		user: req.user._id,
		product: req.params.productId,
	});
	if (!product)
		return next(
			new AppError(401, "there is no product in your cart by this id")
		);
	// check if the quantity is 1
	if (product.quantity === 1)
		await CartProducts.findOneAndDelete({
			product: req.params.productId,
			user: req.user._id,
		});
	// more than one
	else {
		product.quantity = product.quantity - 1;
		await product.save();
	}
	res.status(201).json({
		status: "success",
		message: "deleted ",
	});
};
// delete  a selected product
const deleteProductFromCart = async (req, res, next) => {
	// check if the product exicts in the cart
	const product = await CartProducts.findOne({
		user: req.user._id,
		product: req.params.productId,
	});
	if (!product)
		return next(
			new AppError(401, "there is no product in your cart by this id")
		);
	// delte it
	await CartProducts.findByIdAndDelete(product._id);
	res.status(201).json({
		status: "success",
		message: "deleted ",
	});
};

module.exports = { addProductTotheCart, deleteOneItem, deleteProductFromCart };
