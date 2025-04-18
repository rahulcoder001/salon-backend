const prisma = require("../config/db");

const getRecentClientsCount = async (req, res) => {
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
  
      // Count clients in all branches of the salon created in last 30 days
      const totalClients = await prisma.client.count({
        where: {
          branch: {
            salon_id: salonId,
          },
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });
  
      return res.status(200).json({
        message: 'Recent clients count retrieved successfully',
        totalClients,
      });
  
    } catch (error) {
      console.error('Error getting recent clients count:', error);
      return res.status(500).json({ message: 'Failed to retrieve client count' });
    }
  };

  const addClient = async (req, res) => {
    try {
      const { branchId, salonId, client_name, email, contact, staffId } = req.body;
  
      // Validate required fields
      if (!branchId || !salonId || !client_name || !contact) {
        return res.status(400).json({
          success: false,
          message: 'Branch ID, Salon ID, Name, and Contact are required fields'
        });
      }
  
      // Verify branch belongs to the specified salon
      const branch = await prisma.branch.findFirst({
        where: {
          id: branchId,
          salon_id: salonId
        }
      });
  
      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found in the specified salon'
        });
      }
  
      // Validate email format if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
  
      // Validate contact number format (10 digits)
      if (!/^\d{10}$/.test(contact)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid contact number (must be 10 digits)'
        });
      }
  
      // Check for existing client in the same branch
      const existingClient = await prisma.client.findFirst({
        where: {
          branch_id: branchId,
          OR: [
            { email: email || undefined },
            { contact }
          ]
        }
      });
  
      if (existingClient) {
        return res.status(409).json({
          success: false,
          message: 'Client already exists in this branch',
          conflictField: existingClient.email === email ? 'email' : 'contact'
        });
      }
  
      // Create new client
      const newClient = await prisma.client.create({
        data: {
          client_name,
          email: email || null,
          contact,
          branch_id: branchId,
          staff_id: staffId || null
        },
        include: {
          branch: true,
          staff: true
        }
      });
  
      return res.status(201).json({
        success: true,
        message: 'Client added successfully',
        data: newClient
      });
  
    } catch (error) {
      console.error('Error adding client:', error);
  
      // Handle Prisma errors
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Duplicate entry - client already exists'
        });
      }
  
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
  


  module.exports={getRecentClientsCount,addClient}
