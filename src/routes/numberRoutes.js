const express = require("express");

const router = express.Router();

router.get("/totalclient/:salonId",getTotalClientsBySalonId)
 
module.exports = router;
