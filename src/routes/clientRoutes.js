const express = require("express");
const { getRecentClientsCount, addClient } = require("../controllers/clientscontrollers");


const router = express.Router();

router.get("/totalclients/:salonId",getRecentClientsCount);
router.post("/addclients",addClient);
module.exports = router;
