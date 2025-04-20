const express = require("express");
const { getFinancialData } = require("../controllers/financecontroller");


const router = express.Router();

router.post("/financialreport",getFinancialData)



module.exports = router;