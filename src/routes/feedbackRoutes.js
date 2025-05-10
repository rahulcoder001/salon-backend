const express = require("express");
const { updateFeedbackFeature, getAppointmentDetails } = require("../controllers/feedbackcontroller");


const router = express.Router();


router.put("/updatefeatur/:id",updateFeedbackFeature);
router.get("/getappointment/:appointmentId",getAppointmentDetails)


module.exports = router;