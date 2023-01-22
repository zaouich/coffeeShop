const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRouter");
const reviewsRouter = require("./routers/reveiwsRouter");
const CartProductsRouter = require("./routers/cartProductsRouter");
const errController = require("./controllers/errController");
// security
const helmet = require("helmet");
const rateLmit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const AppError = require("./utils/AppError");
const catchAsync = require("./utils/catchAsync");
const app = express();

app.use(helmet()); // http
const limiter = rateLmit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "too many reqs on one hour ",
}); // rating limit
app.use(express.json());
app.use(xss()); // html
app.use(sanitize()); // no sql
app.use(
	hpp({
		whitelist: ["price", "categorie", "image", "description", "name"],
	})
); // api featurs
app.use(limiter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/cartProducts", CartProductsRouter);
app.all("*", (req, res) => res.status(204).send("ops..204"));
app.use(errController);
module.exports = app;
//
