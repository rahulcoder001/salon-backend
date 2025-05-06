const express = require("express");
const { getPlanRevenue } = require("../controllers/purchasedplancontroller");


const router = express.Router();

// User Signup & Login
router.get("/getreveneue",getPlanRevenue)




module.exports = router;