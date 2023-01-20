const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

const postCartProduct = catchAsync(async (req, res, next) => {
	const { quantity } = req.body;
	const cart = await Cart.create({
		quantity,
		user: req.user._id,
		product: req.params.productId,
	});
});

module.exports = { postCartProduct };
