const express = require("express");
const { getRecentClientsCount } = require("../controllers/clientscontrollers");


const router = express.Router();

router.get("/totalclients/:salonId",getRecentClientsCount);
module.exports = router;
