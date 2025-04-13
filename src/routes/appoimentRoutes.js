const express = require("express");
const { createAppointment, getAppointmentsBySalon, updateAppointment, deleteAppointment } = require("../controllers/appoimentmaagement");



const router = express.Router();

router.post('/create', createAppointment);

// Get appointments by salon
router.get('/:salonId', getAppointmentsBySalon);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);
 
module.exports = router;
