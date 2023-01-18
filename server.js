const { default: mongoose } = require("mongoose");
const app = require("./app");
const DB = process.env.DB;
mongoose.set("strictQuery", false);

mongoose.connect(DB).then(() => console.log("connected to the db"));
app.listen(3000, () => {
	console.log("listning to the port 3000 ....");
});
