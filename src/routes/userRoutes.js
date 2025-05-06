const express = require("express");
const { 
  userLogin, 
  userSignup, 
  changePassword, 
  getUserById,  // ✅ Step 1: Import the controller
  updateUser,
  getUsersByPeriod,
  getAllUsersWithContactInfo
} = require("../controllers/userController");

const router = express.Router();

// User Signup & Login
router.post("/signup", userSignup);
router.post("/login", userLogin);

// Password reset
router.post("/forgetpassword", changePassword);

router.get("/getalluser",getUsersByPeriod)
router.get("/getallusercontactinfo",getAllUsersWithContactInfo)
router.get("/:user_id", getUserById);
router.put("/:user_id",updateUser)



module.exports = router;
