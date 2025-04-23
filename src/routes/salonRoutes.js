const express = require("express");
const { createSalon, getSalonById, updateSalon } = require("../controllers/salonController");


const router = express.Router();

router.post("/create", createSalon);
router.post("/getsalonbyid", getSalonById);
router.put("/updatesalon",updateSalon)
 
module.exports = router;
