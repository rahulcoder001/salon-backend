const prisma = require("../config/db");

const updateFeedbackFeature = async (req, res) => {
  const { id } = req.params;
  const { isFeatured } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Feedback ID is required." });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { feature: isFeatured },
    });

    return res.status(200).json({
      message: "Feature status updated successfully.",
      data: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback feature:", error);
    return res.status(500).json({ message: "Failed to update feature status." });
  }
};

async function getAppointmentDetails(req, res) {
    try {
        const { appointmentId } = req.params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                client: true,
                staff: {
                    include: {
                        user: true,
                        branch: true
                    }
                },
                branch: true,
                service: true,
                salon: true,
                usedProducts: true
            }
        });

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Structure the response
        const response = {
            appointmentDetails: {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status
            },
            clientDetails: {
                id: appointment.client.id,
                name: appointment.client.client_name,
                email: appointment.client.email,
                contact: appointment.client.contact,
                createdAt: appointment.client.createdAt
            },
            staffDetails: {
                id: appointment.staff.id,
                name: appointment.staff.fullname,
                email: appointment.staff.email,
                contact: appointment.staff.contact,
                branch: appointment.staff.branch.branch_name,
                profileImage: appointment.staff.profile_img
            },
            serviceDetails: {
                id: appointment.service.id,
                name: appointment.service.service_name,
                price: appointment.service.service_price,
                duration: appointment.service.time
            },
            branchDetails: {
                id: appointment.branch.id,
                name: appointment.branch.branch_name,
                location: appointment.branch.branch_location,
                openingHours: `${appointment.branch.opning_time} - ${appointment.branch.closeings_time}`,
                contact: {
                    email: appointment.branch.contact_email,
                    phone: appointment.branch.contact_number
                }
            },
            salonDetails: {
                id: appointment.salon.id,
                name: appointment.salon.salon_name,
                contact: {
                    email: appointment.salon.contact_email,
                    phone: appointment.salon.contact_number
                },
                image: appointment.salon.salon_img_url
            },
            usedProducts: appointment.usedProducts.map(product => ({
                productName: product.product_name,
                price: product.price,
                usedBy: product.staff_id,
                usedAt: product.date
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



// Feedback Endpoint
const addfeedback = async (req, res) => {
  try {
    const { client_id, branch_id, staff_id, rating, review } = req.body;

    // Validation
    if (!appointmentId || !rating || !review) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

   

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        client_id,
        branch_id,
        staff_id,
        rating,
        review
      }
    });
    res.status(201).json(feedback);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {updateFeedbackFeature,getAppointmentDetails,addfeedback} ;
