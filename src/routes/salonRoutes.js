const express = require("express");
const { createSalon } = require("../controllers/salonController");


const router = express.Router();

router.post("/create", createSalon);

 
module.exports = router;
