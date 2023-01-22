const { Router } = require("express");
const {
	addProductTotheCart,
	deleteOneItem,
	deleteProductFromCart,
} = require("../controllers/cartProductsController");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");

// productId
const router = Router({ mergeParams: true });
router.use(checkLogin);

router
	.route("/")
	.post(addProductTotheCart)
	.patch(deleteOneItem)
	.delete(deleteProductFromCart);

module.exports = router;
