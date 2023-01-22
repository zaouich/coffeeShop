const { Schema, mongoose } = require("mongoose");

const cartProductsSchema = new Schema({
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

const CartProducts = mongoose.model("CartProducts", cartProductsSchema);
module.exports = CartProducts;
