const express = require("express");
const { sendSMS } = require("../controllers/smscompaignController");

const router = express.Router();

router.post('/send-sms', sendSMS);

module.exports = router;
