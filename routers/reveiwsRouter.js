const { Router } = require("express");
const {
	addReview,
	checkReview,
	deleteReview,
} = require("../controllers/reviewsController");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");

const router = Router({ mergeParams: true });

router.use(checkLogin);
router.route("/").post(addReview);
router.use(checkReview);
router.route("/").delete(deleteReview);
module.exports = router;
