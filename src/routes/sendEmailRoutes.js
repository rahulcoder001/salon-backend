const express = require("express");
const { Sendotp, welcomMail,forgotPasswordMail,passwordResetConfirmation, appointmentConfirmationMail, feedbackRequestMail, appointmentCancellationMail } = require("../controllers/sendemailController");
const router = express.Router();
router.post("/send-otp",Sendotp);
router.post("/sendwelcomemail", welcomMail)
router.post("/forgot",forgotPasswordMail)
router.post("/reset",passwordResetConfirmation)
router.post("/appointmentemail",appointmentConfirmationMail)
router.post("/feedbackemail",feedbackRequestMail)
router.post("/cancelappointment",appointmentCancellationMail)
module.exports = router;
