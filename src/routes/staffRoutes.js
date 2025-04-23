const express = require("express");
const { staffLogin,staffSignup, getStaffById, addSalary, getStaffByIdatnav } = require("../controllers/staffController");

const router = express.Router();

router.post("/login", staffLogin);
router.post("/signup",staffSignup)
router.get("/getstaff/:id",getStaffById)
router.get("/get/:id",getStaffByIdatnav)
router.post("/addsallary", addSalary)
module.exports = router;
