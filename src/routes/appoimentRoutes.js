const express = require("express");
const { createAppointment, getAppointmentsBySalon, updateAppointment, deleteAppointment, getSalonRevenueLast30Days, getRecentAppointmentsCount } = require("../controllers/appoimentmaagement");
const router = express.Router();

router.post('/create', createAppointment);

// Get appointments by salon
router.get('/:salonId', getAppointmentsBySalon);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

router.get("/totalprice/:salonId",getSalonRevenueLast30Days)
router.get("/latestappointment/:salonId",getRecentAppointmentsCount)
 
module.exports = router;
