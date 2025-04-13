const express = require("express");
const { getTotalClientsBySalonId, getTotalStaffBySalonId } = require("../controllers/numberController");

const router = express.Router();

router.get("/totalclient/:salonId",getTotalClientsBySalonId)
router.get("/totalstaff/:salonId",getTotalStaffBySalonId)
 
module.exports = router;
