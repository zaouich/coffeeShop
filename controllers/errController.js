const deveHandler = (err, res) => {
	res.status(err.statusCode || 500).json({
		err,
		message: err.message,
		stack: err.stack,
	});
};
const errController = (err, req, res, next) => {
	console.error(err);
	if (process.env.NODE_ENV === "deve") return deveHandler(err, res);
};
module.exports = errController;
