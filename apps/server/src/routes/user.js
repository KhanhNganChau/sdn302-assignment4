const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.api.controller");
const authenticate = require("../middlewares/authenticate");

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  userController.getAllUsers,
);
router.get("/me", authenticate.verifyUser, userController.getCurrentUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete(
  "/:userId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  userController.deleteUser,
);

module.exports = router;
