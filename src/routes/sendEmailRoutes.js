const express = require("express");
const { Sendotp, welcomMail } = require("../controllers/sendemailController");
const router = express.Router();
router.post("/send-otp",Sendotp);
router.post("/sendwelcomemail", welcomMail)
module.exports = router;
