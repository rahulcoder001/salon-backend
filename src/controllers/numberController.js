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

 module.exports={getTotalClientsBySalonId}