const express = require("express");
const { staffLogin,staffSignup, getStaffById } = require("../controllers/staffController");

const router = express.Router();

router.post("/login", staffLogin);
router.post("/signup",staffSignup)
router.get("/getstaff/:id",getStaffById)
module.exports = router;
