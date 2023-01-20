const Product = require("../models/productsModel");
const AppError = require("../utils/AppError");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/usersModel");

// password
const checkPassword = catchAsync(async (req, next) => {
	const user = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password, user.password)))
		return next(
			new AppError(400, "you should enter you valid current password")
		);
});
// get all products
const getAllProducts = catchAsync(async (req, res, next) => {
	const query_ = { ...req.query };

	// valid query
	const nonValid = ["sort", "page", "limit", "fields"];
	Object.keys(query_).forEach((el) => {
		if (nonValid.includes(el)) delete query_[el];
	});
	// basic query
	// gte
	var queryString = JSON.stringify(query_);
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte)\b/g,
		(match) => `$${match}`
	);
	console.log(JSON.parse(queryString), "ùùùùùùùùù");
	var query = Product.find(JSON.parse(queryString));
	// sorting
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");

		query.sort(sortBy);
	} else query.sort("-price");
	// fields
	if (req.query.fields) {
		const fields = req.query.fields.split(",").join(" ");
		query.select(fields);
	} else query.select("-__v");
	console.log(queryString);
	//pagination
	const limit = req.query.limit * 1 || 3;
	const page = req.query.page * 1 || 1;
	const skip = (page - 1) * limit;
	query = query.skip(skip).limit(limit);
	const products = await query;

	res.status(200).json({
		status: "success",
		products,
	});
});
// get one product
const getOneProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	console.log(product);
	res.status(200).json({
		status: "success",
		product,
	});
});
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) return cb(null, true);
	cb(new AppError(400, "not a image please try another one"), false);
};
const sharpImage = async (req, res, next) => {
	if (!req.file) return next();
	const fileName = `2.jpeg`;
	req.file.fileName = fileName;
	await sharp(req.file.buffer)
		.resize(1000, 1000)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile("public/images/main/" + fileName);
	next();
};
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
}).single("image");
// add product
const addProduct = catchAsync(async (req, res, next) => {
	console.log(req.body);
	const { name, description, categorie, price } = req.body;
	console.log(req.file, "***************");
	var image = "";
	if (req.file) {
		console.log(req.file.filename);
		image = req.file.fileName;
	}
	const coffee = await Product.create({
		name,
		description,
		categorie,
		price,
		image,
	});
});
// update product
const updateProduct = catchAsync(async (req, res, next) => {
	checkPassword(req, next);
	const body_ = { ...req.body };
	const valid = ["name", "description", "categorie", "price"];
	Object.keys(body_).forEach((el) => {
		if (!valid.includes(el)) delete body_[el];
	});
	if (req.file) body_["image"] = req.file.filename;
	const updated = await Product.findByIdAndUpdate(req.params.id, body_, {
		new: true,
	});
	res.status(201).json({
		status: "success",
		updated,
	});
});
// delete all products
const deleteAllProducts = catchAsync(async (req, res, next) => {
	checkPassword(req, next);
	await Product.deleteMany();
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
});
// delete one file
const deleteOneProduct = catchAsync(async (req, res, next) => {
	checkPassword(req, next);
	await Product.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: "success",
		message: "deleted",
	});
});
const checkProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) return next(new AppError(400, "no product found by this id"));
	next();
};
module.exports = {
	getAllProducts,
	addProduct,
	upload,
	updateProduct,
	deleteAllProducts,
	deleteOneProduct,
	getOneProduct,
	sharpImage,
	checkProduct,
};
