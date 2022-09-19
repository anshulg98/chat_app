const {
	login,
	register,
	getAllUsers,
	setAvatar,
	logOut,
	deleteUser,
} = require("../controllers/userController");
const AuthController = require("../controllers/userController");
const Middleware = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.post("/logout", logOut);
router.post("/delUser",deleteUser);
router.post("/auth/refresh_token", AuthController.generateRefreshToken);
router.get("/protected_resource", Middleware.checkAuth, (req, res) => {
	return res.status(200).json({ user: req.user });
});
module.exports = router;
