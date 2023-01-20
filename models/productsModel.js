const { Mongoose, model, Schema } = require("mongoose");

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "why no product name ?"],
			unique: [true, "this coffee is already found you wanna update it ?"],
		},
		description: {
			type: String,
			required: [true, "why no product description ?"],
		},
		image: {
			type: String,
			required: [true, "why no product image ?"],
		},
		categorie: {
			type: String,
			enum: {
				values: ["noire", "chocolat-cafe-au-lait"],
				message: "should just be noire or chocolat cafe au lait",
			},
			required: [true, "why no product categorie ?"],
		},
		price: {
			type: Number,
			required: [true, "why no product price ?"],
		},
		rating: {
			type: Number,
		},
		nRating: {
			tupe: Number,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

productSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});
productSchema.pre(/^find/, function (next) {
	this.find({}).populate("reviews");
	next();
});
const Product = model("Product", productSchema);
module.exports = Product;
