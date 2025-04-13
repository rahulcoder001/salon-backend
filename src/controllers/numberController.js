const prisma = require("../config/db");


const getTotalClientsBySalonId = async (req, res) => {
    const { salonId } = req.params;
  
    try {
      // Check if salon exists
      const salonExists = await prisma.salon.findUnique({
        where: { id: salonId },
      });
  
      if (!salonExists) {
        return res.status(404).json({ message: 'Salon not found' });
      }
  
      // Count clients across all branches
      const totalClients = await prisma.client.count({
        where: {
          branch: {
            salon_id: salonId,
          },
        },
      });
  
      return res.status(200).json({ 
        message: 'Total clients retrieved successfully',
        totalClients 
      });
  
    } catch (error) {
      console.error('Error getting total clients:', error);
      return res.status(500).json({ message: 'Failed to retrieve client count' });
    }
  };

 const getTotalStaffBySalonId = async (req, res) => {
    const { salonId } = req.params;
  
    try {
      // Check if salon exists
      const salonExists = await prisma.salon.findUnique({
        where: { id: salonId },
      });
  
      if (!salonExists) {
        return res.status(404).json({ message: 'Salon not found' });
      }
  
      // Count staff across all branches of the salon
      const totalStaff = await prisma.staff.count({
        where: {
          branch: {
            salon_id: salonId,
          },
        },
      });
  
      return res.status(200).json({ 
        message: 'Total staff retrieved successfully',
        totalStaff 
      });
  
    } catch (error) {
      console.error('Error getting total staff:', error);
      return res.status(500).json({ message: 'Failed to retrieve staff count' });
    }
  };

  const getTotalServicesBySalonId = async (req, res) => {
    const { salonId } = req.params;
  
    try {
      // Verify salon exists
      const salonExists = await prisma.salon.findUnique({
        where: { id: salonId },
      });
  
      if (!salonExists) {
        return res.status(404).json({ message: 'Salon not found' });
      }
  
      // Count services across all branches of the salon
      const totalServices = await prisma.service.count({
        where: {
          branch: {
            salon_id: salonId,
          },
        },
      });
  
      return res.status(200).json({ 
        message: 'Total services retrieved successfully',
        totalServices 
      });
  
    } catch (error) {
      console.error('Error getting total services:', error);
      return res.status(500).json({ message: 'Failed to retrieve services count',error:error });
    }
  };

 module.exports={getTotalClientsBySalonId,getTotalStaffBySalonId,getTotalServicesBySalonId}