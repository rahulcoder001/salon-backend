const prisma = require("../config/db");

// **Create Salon**
const createSalon = async (req, res) => {
  const {
    salon_name,
    salon_tag,
    opening_time,
    contact_email,
    contact_number,
    salon_img_url,
    user_id, // User ID passed in request
  } = req.body;

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new salon
    const newSalon = await prisma.salon.create({
      data: {
        salon_name,
        salon_tag,
        opening_time: opening_time || null,
        contact_email,
        contact_number,
        branch_url: branch_url || null,
        salon_img_url: salon_img_url || null,
      },
    });

    // Update user's salon_id with the newly created salon's ID
    await prisma.user.update({
      where: { id: user_id },
      data: { salon_id: newSalon.id },
    });

    res.status(201).json({ message: "Salon created successfully", salon: newSalon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createSalon };
