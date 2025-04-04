const express = require("express");
const { 
  userLogin, 
  userSignup, 
  changePassword, 
  getUserById  // ✅ Step 1: Import the controller
} = require("../controllers/userController");

const router = express.Router();

// User Signup & Login
router.post("/signup", userSignup);
router.post("/login", userLogin);

// Password reset
router.post("/forgetpassword", changePassword);

// ✅ Step 2: Add route to get user by ID
router.get("/:user_id", getUserById);

module.exports = router;
