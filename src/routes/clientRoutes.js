const express = require("express");
const { getRecentClientsCount, addClient, getClientsBySalon, updateClient, deleteClient } = require("../controllers/clientscontrollers");


const router = express.Router();

router.get("/totalclients/:salonId",getRecentClientsCount);
router.post("/addclients",addClient);
router.get("/gettotalclient/:salon_id", getClientsBySalon);
router.put("/updateclient/:id", updateClient);
router.delete("/deleteclient/:id", deleteClient);
module.exports = router;
