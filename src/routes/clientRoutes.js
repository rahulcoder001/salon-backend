const express = require("express");
const { getRecentClientsCount, addClient, getClientsBySalon } = require("../controllers/clientscontrollers");


const router = express.Router();

router.get("/totalclients/:salonId",getRecentClientsCount);
router.post("/addclients",addClient);
router.get("/gettotalclient/:salon_id", getClientsBySalon)
module.exports = router;
