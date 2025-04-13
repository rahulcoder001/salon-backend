const express = require("express");
const { getTotalClientsBySalonId } = require("../controllers/numberController");

const router = express.Router();

router.get("/totalclient/:salonId",getTotalClientsBySalonId)
 
module.exports = router;
