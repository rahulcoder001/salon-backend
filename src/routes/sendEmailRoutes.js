const express = require("express");
const { Sendotp, welcomMail,forgotPasswordMail,passwordResetConfirmation } = require("../controllers/sendemailController");
const router = express.Router();
router.post("/send-otp",Sendotp);
router.post("/sendwelcomemail", welcomMail)
router.post("/forgot",forgotPasswordMail)
router.post("/reset",passwordResetConfirmation)
module.exports = router;
