const express = require("express");
const { createSalon, getSalonById } = require("../controllers/salonController");


const router = express.Router();

router.post("/create", createSalon);
router.post("/getsalonbyid", getSalonById);
 
module.exports = router;
