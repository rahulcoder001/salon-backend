const express = require("express");
const { updateFeedbackFeature } = require("../controllers/feedbackcontroller");


const router = express.Router();


router.put("/updatefeatur/:id",updateFeedbackFeature);


module.exports = router;