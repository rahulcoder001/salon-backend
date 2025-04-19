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
      const { client_name, contact, email, salon_id } = req.body;
  
      if (!client_name || !contact || !email || !salon_id) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if the email already exists in the Client table
      const existingClient = await prisma.client.findFirst({
        where: {
          email: email
        }
      });
  
      if (existingClient) {
        return res.status(409).json({ message: "Client with this email already exists." });
      }
  
      // Create new client
      const newClient = await prisma.client.create({
        data: {
          client_name,
          contact,
          email,
          salon_id
        }
      });
  
      return res.status(201).json({
        message: "Client added successfully.",
        client: newClient
      });
  
    } catch (error) {
      console.error("Error adding client:", error);
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  };
  



module.exports={getRecentClientsCount,addClient}
