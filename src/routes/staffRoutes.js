const express = require("express");
const { staffLogin,staffSignup } = require("../controllers/staffController");

const router = express.Router();

router.post("/login", staffLogin);
router.post("/signup",staffSignup)

module.exports = router;
