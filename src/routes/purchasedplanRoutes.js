const express = require("express");
const { getPlanRevenue, getTopSalesmen, getRevenueLastSixMonths } = require("../controllers/purchasedplancontroller");


const router = express.Router();

// User Signup & Login
router.get("/getreveneue",getPlanRevenue)
router.get("/gettopseller", getTopSalesmen)
router.get("/revenuedata", getRevenueLastSixMonths)



module.exports = router;