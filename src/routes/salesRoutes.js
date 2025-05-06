const express = require("express");
const { getAllSalesmen, addSalesPerson } = require("../controllers/salesControllers");



const router = express.Router();

router.get("/getsalesperson",getAllSalesmen)
router.post("/addsales",addSalesPerson)
 
module.exports = router;