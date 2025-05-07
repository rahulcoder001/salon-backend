const express = require("express");
const { getalladminfinacedata } = require("../controllers/adminfinanceController");

const router = express.Router();


router.get("/getadminfinance", getalladminfinacedata)


module.exports = router;