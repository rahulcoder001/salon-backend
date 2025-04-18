const express = require("express");
const { getRecentClientsCount, addClient } = require("../controllers/clientscontrollers");


const router = express.Router();

router.get("/totalclients/:salonId",getRecentClientsCount);
router.get("/addclients/:salonId",addClient);
module.exports = router;
