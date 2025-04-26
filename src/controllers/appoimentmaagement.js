const prisma = require("../config/db");


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
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate allowed status values
    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowedValues: allowedStatuses
      });
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update only the status field
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        salon: true,
        branch: true,
        staff: true,
        service: true,
        client: true,
      },
    });

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment status",
      error: error.message
    });
  }
};

// Delete appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status to cancelled instead of deleting
    const cancelledAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: "cancelled"
      },
      include: {
        salon: true,
        branch: true,
        staff: true,
        service: true,
        client: true,
      },
    });

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment: cancelledAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};




const getSalonRevenueLast30Days = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Verify salon exists
    const salonExists = await prisma.salon.findUnique({
      where: { id: salonId },
    });

    if (!salonExists) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all appointments for the salon's branches in last 30 days
    const appointments = await prisma.appointment.findMany({
      where: {
        salon_id: salonId,
        date: {
          gte: thirtyDaysAgo.toISOString(),
        }
      },
      include: {
        service: {
          select: {
            service_price: true
          }
        }
      }
    });

    // Calculate total revenue
    const totalRevenue = appointments.reduce((sum, appointment) => {
      return sum + (appointment.service?.service_price || 0);
    }, 0);

    return res.status(200).json({
      message: 'Revenue calculated successfully',
      totalRevenue,
      currency: 'Base currency units'
    });

  } catch (error) {
    console.error('Error calculating revenue:', error);
    return res.status(500).json({ message: 'Failed to calculate revenue' });
  }
};


const getRecentAppointmentsCount = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Verify salon exists
    const salonExists = await prisma.salon.findUnique({
      where: { id: salonId },
    });

    if (!salonExists) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Calculate date 30 days ago in YYYY-MM-DD format
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];

    // Count appointments for the salon in last 30 days
    const totalAppointments = await prisma.appointment.count({
      where: {
        salon_id: salonId,
        date: {
          gte: formattedDate
        }
      }
    });

    return res.status(200).json({
      message: 'Recent appointments count retrieved successfully',
      totalAppointments
    });

  } catch (error) {
    console.error('Error getting recent appointments count:', error);
    return res.status(500).json({ message: 'Failed to retrieve appointments count' });
  }
};


module.exports = {
  createAppointment ,
  getAppointmentsBySalon , 
  cancelAppointment , 
  updateAppointmentStatus,
  getSalonRevenueLast30Days,
  getRecentAppointmentsCount
};
