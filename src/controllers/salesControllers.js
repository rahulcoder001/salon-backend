const prisma = require("../config/db");

const getAllSalesmen = async (req, res) => {
  try {
    const salesmen = await prisma.salesman.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        commission: true,
        users: {
          select: {
            id: true,
            fullname: true,
            email: true,
            contact: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Modified response for empty results
    if(salesmen.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No salesmen found in database",
        data: []
      });
    }

    const formattedSalesmen = salesmen.map(salesman => ({
      id: salesman.id,
      name: salesman.name,
      email: salesman.email,
      contact: salesman.contact,
      commission: salesman.commission,
      total_users: salesman.users.length,
      users: salesman.users.map(user => ({
        id: user.id,
        name: user.fullname,
        email: user.email,
        contact: user.contact,
        joined_at: user.createdAt
      }))
    }));

    res.status(200).json({
      success: true,
      count: salesmen.length,
      data: formattedSalesmen
    });

  } catch (error) {
    console.error("Get Salesmen Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching salesmen",
      error: error.message
    });
  }
};

const addSalesPerson = async (req, res) => {
    try {
      const { name, email, contact, commission } = req.body;
  
      // Validate required fields
      if (!name || !email || !contact || !commission) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: name, email, contact, commission"
        });
      }
  
      // Check if salesman already exists
      const existingSalesman = await prisma.salesman.findFirst({
        where: {
          OR: [
            { email: email },
            { contact: contact }
          ]
        }
      });
  
      if (existingSalesman) {
        return res.status(400).json({
          success: false,
          message: "Salesman with this email or contact already exists"
        });
      }
  
      // Create new salesman
      const newSalesman = await prisma.salesman.create({
        data: {
          name: name,
          email: email,
          contact: contact,
          commission: parseFloat(commission),
          // Add other default fields if needed
        },
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
          commission: true,
          createdAt: true
        }
      });
  
      res.status(201).json({
        success: true,
        message: "Salesperson created successfully",
        data: newSalesman
      });
  
    } catch (error) {
      console.error("Add Salesperson Error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating salesperson",
        error: error.message
      });
    }
  };

module.exports = {
  getAllSalesmen,
  addSalesPerson
};