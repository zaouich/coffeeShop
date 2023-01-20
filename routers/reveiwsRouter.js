const { Router } = require("express");
const {
	addReview,
	checkReview,
	deleteReview,
	updateReview,
	checkProduct,
	getAllReviews,
	getOneReview,
} = require("../controllers/reviewsController");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");

const router = Router({ mergeParams: true });

router.use(checkLogin);
router.route("/").get(restrictTo("admin"), getAllReviews);
router.route("/:reviewId").get(restrictTo("admin"), getOneReview);
router.use(checkProduct, checkReview);
router.route("/").delete(deleteReview).patch(updateReview).post(addReview);
module.exports = router;
