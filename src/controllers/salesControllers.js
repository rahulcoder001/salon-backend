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
        referralCode: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            fullname: true,
            email: true,
            contact: true,
            createdAt: true,
            PurchasedPlan: {
              select: {
                package: {
                  select: {
                    price: true
                  }
                }
              }
            }
          }
        },
        salaries: {
          select: {
            id: true,
            amount: true,
            date: true // Changed from createdAt to date
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if(salesmen.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No salesmen found",
        data: []
      });
    }

    const formattedSalesmen = salesmen.map(salesman => ({
      id: salesman.id,
      name: salesman.name,
      email: salesman.email,
      contact: salesman.contact,
      commission: salesman.commission,
      referralCode: salesman.referralCode,
      totalUsers: salesman.users.length,
      totalRevenue: salesman.users.reduce((acc, user) => 
        acc + user.PurchasedPlan.reduce((sum, plan) => sum + (plan.package?.price || 0), 0)
      , 0),
      totalSalary: salesman.salaries.reduce((sum, salary) => sum + salary.amount, 0),
      salaries: salesman.salaries.map(salary => ({
        id: salary.id,
        amount: salary.amount,
        date: salary.date // Changed from createdAt to date
      })),
      createdAt: salesman.createdAt
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
      message: "Internal server error",
      error: error.message
    });
  }
};

const addSalesPerson = async (req, res) => {
  try {
    const { name, email, contact, commission } = req.body;

    // Validate input
    if (!name || !email || !contact || !commission) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, contact, commission"
      });
    }

    // Validate commission value
    if (isNaN(commission) || commission < 0 || commission > 100) {
      return res.status(400).json({
        success: false,
        message: "Commission must be a number between 0 and 100"
      });
    }

    // Check existing salesman
    const existingSalesman = await prisma.salesman.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { contact: contact }
        ]
      }
    });

    if (existingSalesman) {
      return res.status(409).json({
        success: false,
        message: "Salesman with this email or contact already exists"
      });
    }

    // Generate unique referral code
    const generateReferralCode = (name) => {
      const cleanName = name.replace(/\s+/g, '').toUpperCase();
      const namePart = cleanName.slice(0, 5).padEnd(5, 'X');
      const randomPart = Math.floor(100 + Math.random() * 900);
      return `${namePart}${randomPart}`;
    };

    let referralCode;
    let isUnique = false;
    let attempts = 0;
    
    // Ensure unique referral code with retry logic
    while (!isUnique && attempts < 5) {
      referralCode = generateReferralCode(name);
      const existingCode = await prisma.salesman.findUnique({
        where: { referralCode }
      });
      if (!existingCode) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique referral code. Please try again."
      });
    }

    // Create new salesman
    const newSalesman = await prisma.salesman.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        contact: contact.trim(),
        commission: parseFloat(commission),
        referralCode: referralCode
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        commission: true,
        referralCode: true,
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
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: "Unique constraint violation. Salesman with this data already exists."
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const getSalesmanById = async (req, res) => {
  try {
    const { sales_id } = req.params;

    if (!sales_id) {
      return res.status(400).json({
        success: false,
        message: "Salesman ID is required"
      });
    }

    const salesman = await prisma.salesman.findUnique({
      where: { id: sales_id },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        commission: true,
        referralCode: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            fullname: true,
            email: true,
            contact: true,
            createdAt: true,
            PurchasedPlan: {
              select: {
                package: {
                  select: {
                    price: true
                  }
                }
              }
            }
          }
        },
        salaries: {
          select: {
            amount: true,
            date: true
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found"
      });
    }

    // Formatting response
    const formattedSalesman = {
      ...salesman,
      totalUsers: salesman.users.length,
      totalRevenue: salesman.users.reduce((acc, user) => 
        acc + user.PurchasedPlan.reduce((sum, plan) => sum + (plan.package?.price || 0), 0)
      , 0),
      
    };

    res.status(200).json({
      success: true,
      data: formattedSalesman
    });

  } catch (error) {
    console.error("Get Salesman by ID Error:", error);
    
    // Handle Prisma not found error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Salesman not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const addSalary = async (req, res) => {
  try {
    const { sales_id } = req.params;
    const { amount } = req.body;

    // Validate input
    if (!sales_id) {
      return res.status(400).json({
        success: false,
        message: "Salesman ID is required"
      });
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid positive salary amount is required"
      });
    }

    // Check if salesman exists
    const salesman = await prisma.salesman.findUnique({
      where: { id: sales_id }
    });

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found"
      });
    }

    // Create new salary record
    const newSalary = await prisma.salesmanSalary.create({
      data: {
        amount: parseInt(amount),
        salesmanId: sales_id
      },
      select: {
        id: true,
        amount: true,
        date: true,
        salesman: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Salary added successfully",
      data: newSalary
    });

  } catch (error) {
    console.error("Add Salary Error:", error);

    // Handle Prisma errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Salesman not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
const getSalesmanCommission = async (req, res) => {
  try {
    const { sales_id } = req.params;

    if (!sales_id) {
      return res.status(400).json({
        success: false,
        message: "Salesman ID is required"
      });
    }

    // Fetch salesman with users, purchased plans and salaries
    const salesman = await prisma.salesman.findUnique({
      where: { id: sales_id },
      select: {
        commission: true,
        users: {
          select: {
            PurchasedPlan: {
              select: {
                package: {
                  select: {
                    price: true
                  }
                }
              }
            }
          }
        },
        salaries: {
          select: {
            amount: true
          }
        }
      }
    });

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found"
      });
    }

    // Calculate total commission
    const totalRevenue = salesman.users.reduce((acc, user) => {
      return acc + user.PurchasedPlan.reduce(
        (sum, plan) => sum + (plan.package?.price || 0),
        0
      );
    }, 0);

    const totalCommission = (salesman.commission / 100) * totalRevenue;
    
    // Calculate paid commission from salaries
    const totalPaid = salesman.salaries.reduce(
      (sum, salary) => sum + salary.amount, 
      0
    );
    
    // Calculate remaining commission
    const leftCommission = totalCommission - totalPaid;

    res.status(200).json({
      success: true,
      data: {
        commissionPercentage: salesman.commission,
        totalSales: totalRevenue,
        totalCommission: totalCommission,
        totalPaid: totalPaid,
        leftCommission: leftCommission,
        formatted: {
          totalCommission: `₹${totalCommission.toFixed(2)}`,
          totalPaid: `₹${totalPaid.toFixed(2)}`,
          leftCommission: `₹${leftCommission.toFixed(2)}`
        }
      }
    });

  } catch (error) {
    console.error("Commission Calculation Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getAllSalesmen,
  addSalesPerson,
  getSalesmanById,
  addSalary,
  getSalesmanCommission
};