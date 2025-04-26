const express = require("express");
const { addAttendance } = require("../controllers/attendenceControllers");
const router = express.Router();

router.post('/add', addAttendance);
 
module.exports = router;
