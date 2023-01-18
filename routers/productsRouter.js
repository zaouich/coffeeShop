const { Router } = require("express");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");

const {
	getAllProducts,
	addProduct,
	upload,
	updateProduct,
	deleteOneProduct,
	deleteAllProducts,
	getOneProduct,
	sharpImage,
	checkProduct,
} = require("../controllers/productsController");

const router = Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(checkProduct, getOneProduct);
router.use(checkLogin, restrictTo("admin"));
router
	.route("/")
	.post(upload, sharpImage, addProduct)
	.delete(deleteAllProducts);
router.use(checkProduct);
router
	.route("/:id")
	.patch(upload, sharpImage, updateProduct)
	.delete(deleteOneProduct);
module.exports = router;
