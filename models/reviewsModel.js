const { Schema, model, default: mongoose } = require("mongoose");
const Product = require("./productsModel");

const reviewsSchema = new Schema({
	text: {
		type: String,
		required: [true, "why no text ?"],
		minlength: [10, "review cant be less than 10 char "],
		maxlength: [100, "max 100 char"],
		required: [true, "why no preview text ?"],
	},
	review: {
		type: Number,
		max: [5, "cant be more than 5"],
		min: [1, "cant be less than 1"],
		required: [true, "how many starts you want to give to this coffee ?"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
	product: {
		type: mongoose.Schema.ObjectId,
		ref: "Product",
	},
});
reviewsSchema.index({ product: 1, user: 1 }, { unique: true });
reviewsSchema.statics.calc = async function (productId) {
	const avrg_ = await this.aggregate([
		{
			$match: {
				product: productId,
			},
		},
		{
			$group: {
				_id: "$product",
				avrg: { $avg: "$review" },
				nRating: { $sum: 1 },
			},
		},
	]);
	if (avrg_.length === 0)
		return await Product.findByIdAndUpdate(productId, {
			nRating: 0,
			rating: 0,
		});
	await Product.findByIdAndUpdate(
		productId,
		{
			nRating: avrg_[0].nRating,
			rating: avrg_[0].avrg,
		},
		{ new: true }
	);
};
reviewsSchema.pre(/^find/, function (next) {
	this.find({}).populate("user", "-password").populate("product");
	next();
});
reviewsSchema.post("save", async function (doc) {
	await doc.constructor.calc(doc.product);
});
reviewsSchema.post(/^findOneAnd/, function (doc) {
	if (doc) return doc.constructor.calc(doc.product);
});
const Review = model("Review", reviewsSchema);
module.exports = Review;
