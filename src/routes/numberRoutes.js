const express = require("express");
const { getTotalClientsBySalonId, getTotalStaffBySalonId, getTotalServicesBySalonId } = require("../controllers/numberController");

const router = express.Router();

router.get("/totalclient/:salonId",getTotalClientsBySalonId)
router.get("/totalstaff/:salonId",getTotalStaffBySalonId)
router.get("/totalservice/:salon_id",getTotalServicesBySalonId)
 
module.exports = router;
