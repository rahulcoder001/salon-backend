const express = require("express");
const { Sendotp, welcomMail,forgotPasswordMail } = require("../controllers/sendemailController");
const router = express.Router();
router.post("/send-otp",Sendotp);
router.post("/sendwelcomemail", welcomMail)
router.post("/forgot",forgotPasswordMail)
module.exports = router;
