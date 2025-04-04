const prisma = require("../config/db");

// **Add Branch**
const addBranch = async (req, res) => {
  const { branch_name, branch_location, salon_id } = req.body;

  try {
    // Check if the salon exists
    const existingSalon = await prisma.salon.findUnique({
      where: { id: salon_id },
    });

    if (!existingSalon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        branch_name,
        branch_location,
        salon_id,
      },
    });

    res.status(201).json({ message: "Branch created successfully", branch: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addBranch };
