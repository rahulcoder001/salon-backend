const express = require("express");
const { staffLogin,staffSignup, getStaffById, addSalary } = require("../controllers/staffController");

const router = express.Router();

router.post("/login", staffLogin);
router.post("/signup",staffSignup)
router.get("/getstaff/:id",getStaffById)
router.post("/addsallary", addSalary)''
module.exports = router;
