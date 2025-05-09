const express = require("express");
const { getAllSalesmen, addSalesPerson, getSalesmanById, addSalary, getSalesmanCommission } = require("../controllers/salesControllers");



const router = express.Router();

router.get("/getsalesperson",getAllSalesmen)
router.post("/addsales",addSalesPerson)
router.get("/getsalesbyid/:sales_id",getSalesmanById)
router.post("/addsalry/:sales_id",addSalary)
router.get("/commision/:sales_id",getSalesmanCommission)
module.exports = router;