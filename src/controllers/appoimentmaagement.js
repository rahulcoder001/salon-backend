const createAppointment = async (req, res) => {
  const {
    salon_id,
    branch_id,
    staff_id,
    service_id,
    client_id,
    date,
    time,
    status,
  } = req.body;

  try {
    // Validate required fields
    if (
      !salon_id ||
      !branch_id ||
      !staff_id ||
      !service_id ||
      !client_id ||
      !date ||
      !time
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if related entities exist
    const [salon, branch, staff, service, client] = await Promise.all([
      prisma.salon.findUnique({ where: { id: salon_id } }),
      prisma.branch.findUnique({ where: { id: branch_id } }),
      prisma.staff.findUnique({ where: { id: staff_id } }),
      prisma.service.findUnique({ where: { id: service_id } }),
      prisma.client.findUnique({ where: { id: client_id } }),
    ]);

    if (!salon || !branch || !staff || !service || !client) {
      return res
        .status(404)
        .json({ message: "One or more related entities not found" });
    }

    // Create new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        salon_id,
        branch_id,
        staff_id,
        service_id,
        client_id,
        date,
        time,
        status: status || "pending",
      },
      include: {
        salon: true,
        branch: true,
        staff: true,
        service: true,
        client: true,
      },
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Get appointments by salon
const getAppointmentsBySalon = async (req, res) => {
  const { salonId } = req.params;

  try {
    const appointments = await prisma.appointment.findMany({
      where: { salon_id: salonId },
      include: {
        salon: true,
        branch: true,
        staff: {
          include: {
            user: true,
          },
        },
        service: true,
        client: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this salon" });
    }

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        salon: true,
        branch: true,
        staff: true,
        service: true,
        client: true,
      },
    });

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};
module.exports = {createAppointment , getAppointmentsBySalon , deleteAppointment , updateAppointment};
