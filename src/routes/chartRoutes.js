const express = require("express");
const { getDailyStatsLast30Days } = require("../controllers/chartControllers");

const router = express.Router();

router.get("/three/:salonId",getDailyStatsLast30Days)
 
module.exports = router;
