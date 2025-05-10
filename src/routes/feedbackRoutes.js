const express = require("express");
const { updateFeedbackFeature, getAppointmentDetails, addfeedback } = require("../controllers/feedbackcontroller");


const router = express.Router();


router.put("/updatefeatur/:id",updateFeedbackFeature);
router.get("/getappointment/:appointmentId",getAppointmentDetails);
router.post("/addfeedback",addfeedback);

module.exports = router;