const deveHandler = (err, res) => {
	res.status(err.statusCode || 500).json({
        err,
        message : err.message
	});
};
const errController = (err, req, res, next) => {
	if (process.env.NODE_ENV === "deve") return deveHandler(err, res);
};
module.exports = errController;
