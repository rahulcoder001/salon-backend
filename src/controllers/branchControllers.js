const prisma = require("../config/db");





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
                staff:true,
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



// Add Branch
const addbrnch = async (req, res) => {
  try {
    const { 
      branch_name, 
      branch_location, 
      contact_email, 
      contact_number, 
      opning_time, 
      closeings_time, 
      salon_id 
    } = req.body;

    const newBranch = await prisma.branch.create({
      data: {
        branch_name,
        branch_location,
        contact_email,
        contact_number,
        opning_time,
        closeings_time,
        salon_id
      }
    });

    res.status(201).json(newBranch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Branch
const updatebranch =  async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: updateData
    });

    res.json(updatedBranch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { addbrnch , IsBranch , updatebranch };
