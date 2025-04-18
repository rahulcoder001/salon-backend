const prisma = require("../config/db");

// **Add Branch**
const addBranch = async (req, res) => {
  const { branch_name, branch_location, salon_id , contact_email,contact_number,opning_time,closeings_time} = req.body;

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
        contact_email,
        contact_number,
        opning_time,
        closeings_time
      },
    });

    res.status(201).json({ message: "Branch created successfully", branch: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const IsBranch = async (req, res) => {
  const { salon_id } = req.body;

  try {
    const branches = await prisma.branch.findMany({
      where: { salon_id: salon_id },
      include: {
        staff: true,  // Directly include staff array
        service: true, // Include services if needed
        inventory: true // Include inventory if needed
      }
    });

    return res.status(201).json({
      isbranch: branches.length > 0,
      branches: branches.map(branch => ({
        ...branch,
        staffCount: branch.staff.length, // Add count if needed
        serviceCount: branch.service.length,
        inventoryCount: branch.inventory.length
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addBranch , IsBranch };
