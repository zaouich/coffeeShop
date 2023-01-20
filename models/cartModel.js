const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
	product: {
		type: mongoose.Schema.ObjectId,
		ref: "Product",
	},
	quantity: {
		type: Number,
		default: 1,
	},
	date: {
		type: Date,
		default: new Date(),
	},
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;

// products/productId/cart
