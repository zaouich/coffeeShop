const { Router } = require("express");
const { checkLogin, restrictTo } = require("../controllers/authConroller.Js");
const { postCartProduct } = require("../controllers/cartController");
const router = Router({ mergeParams: true });

router.use(checkLogin);
router.route("/").post(postCartProduct);
module.exports = router;
