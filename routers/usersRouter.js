const { Router } = require("express");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");
const {
	signUp,
	login,
	updateMe,
	updateMyPassword,
	deleteMe,
	forgotPassword,
	resetPassword,
	getAllUser,
	getOneUser,
	deleteAllUsers,
	deleteOneUser,
} = require("../controllers/usersController");

const router = Router();
router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/forgetPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

router.use(checkLogin);
router.route("/updateMe").patch(updateMe);
router.route("/updateMyPassword").patch(updateMyPassword);
router.route("/deleteMe").patch(deleteMe);
router.use(restrictTo("admin"));
router.route("/").get(getAllUser);
router.route("/:id").get(getOneUser);
router.route("/").delete(deleteAllUsers);
router.route("/:id").delete(deleteOneUser);

module.exports = router;
