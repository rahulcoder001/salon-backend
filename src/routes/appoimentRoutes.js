const express = require("express");
const { createAppointment, getAppointmentsBySalon, updateAppointment, deleteAppointment, getSalonRevenueLast30Days } = require("../controllers/appoimentmaagement");



const router = express.Router();

router.post('/create', createAppointment);

// Get appointments by salon
router.get('/:salonId', getAppointmentsBySalon);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

router.get("/totalprice/:salonId",getSalonRevenueLast30Days)
 
module.exports = router;
