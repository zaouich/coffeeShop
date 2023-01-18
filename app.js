const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRouter");
const errController = require("./controllers/errController");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.all("*", () => console.log("no page found"));
app.use(errController);
module.exports = app;
