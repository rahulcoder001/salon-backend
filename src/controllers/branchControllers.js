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
        staff: {
          include: {
            salaries: true,    // Include salary records
            attendances: true // Include attendance records
          }
        },
        service: true,
        inventory: true,
        usedProducts:{
           include:{
            staff:true,
            appointment: {
               include:{
                service:true,
                client:true
               }
            }
           }
        }
      }
    });

    return res.status(200).json({
      isbranch: branches.length > 0,
      branches: branches.map(branch => ({
        ...branch,
        staffCount: branch.staff.length,
        serviceCount: branch.service.length,
        inventoryCount: branch.inventory.length,
        staff: branch.staff.map(staffMember => ({
          ...staffMember,
          salaries: staffMember.salaries,
          attendances: staffMember.attendances,
          salaryCount: staffMember.salaries.length,
          attendanceCount: staffMember.attendances.length
        }))
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addBranch , IsBranch };
