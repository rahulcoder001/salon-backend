const express = require("express");
const { userLogin , userSignup, changePassword} = require("../controllers/userController");

const router = express.Router();

// User Login Route
router.post("/signup", userSignup)
router.post("/login", userLogin);
router.post("/forgetpassword", changePassword)

module.exports = router;
