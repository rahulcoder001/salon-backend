const express = require("express");
const { createAppointment, getAppointmentsBySalon, updateAppointment, deleteAppointment, getSalonRevenueLast30Days, getRecentAppointmentsCount, cancelAppointment } = require("../controllers/appoimentmaagement");
const router = express.Router();

router.post('/create', createAppointment);

// Get appointments by salon
router.get('/:salonId', getAppointmentsBySalon);

// Update appointment
router.put('/update/:id', updateAppointment);

// Delete appointment
router.put('/cancel/:id', cancelAppointment);

router.get("/totalprice/:salonId",getSalonRevenueLast30Days)
router.get("/latestappointment/:salonId",getRecentAppointmentsCount)
 
module.exports = router;
