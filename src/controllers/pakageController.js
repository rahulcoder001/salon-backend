const prisma = require("../config/db");

// 1. Get All Packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await prisma.subscriptionPackage.findMany({
      include: {
        PurchasedPlan: true,
        activeUsers: true
      }
    });

    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription packages",
      error: error.message
    });
  }
};

// 2. Create New Package
const createPackage = async (req, res) => {
  try {
    const { name, price, description, branchLimit, features } = req.body;

    const newPackage = await prisma.subscriptionPackage.create({
      data: {
        name,
        price,
        description,
        branchLimit,
        features
      }
    });

    res.status(201).json({
      success: true,
      data: newPackage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create package",
      error: error.message
    });
  }
};

// 3. Update Package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isUnlimitedBranches, ...updateData } = req.body;

    // Handle branch limit conversion if needed
    if (typeof isUnlimitedBranches !== 'undefined') {
      updateData.branchLimit = isUnlimitedBranches ? 9999 : updateData.branchLimit;
    }

    const updatedPackage = await prisma.subscriptionPackage.update({
      where: { id },
      data: updateData,
      include: {
        PurchasedPlan: true,
        activeUsers: true
      }
    });

    res.status(200).json({ success: true, data: updatedPackage });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Package not found or update failed",
      error: error.message
    });
  }
};

// 4. Delete Package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if package exists
    const existingPackage = await prisma.subscriptionPackage.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    await prisma.subscriptionPackage.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};



const purchasePlan = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    // Validate user and package
    const [user, package] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }}),
      prisma.subscriptionPackage.findUnique({ where: { id: packageId }})
    ]);

    if (!user || !package) {
      return res.status(404).json({ message: 'User or package not found' });
    }

    // Check if it's a free plan
    if (package.price === 0) {
      // Automatically activate free plan
      const [updatedUser, purchasedPlan] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { activePlanId: packageId }
        }),
        prisma.purchasedPlan.create({
          data: {
            userId,
            packageId,
            date: new Date()
          }
        })
      ]);

      return res.status(200).json({
        message: 'Free plan activated successfully',
        purchasedPlan,
        user: updatedUser
      });
    }

    // For paid plans (will integrate payment gateway later)
    return res.status(200).json({
      message: 'Proceed to payment',
      paymentRequired: true,
      amount: package.price,
      packageId
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkPlanExpiration = () => {
  cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
    try {
      const expirationDate = dayjs().subtract(30, 'day').toDate();
      
      await prisma.user.updateMany({
        where: {
          activePlan: {
            PurchasedPlan: {
              some: {
                date: { lte: expirationDate }
              }
            }
          }
        },
        data: { activePlanId: null }
      });
      
      console.log('Plan expiration check completed');
    } catch (error) {
      console.error('Plan expiration error:', error);
    }
  });
};

module.exports = {getAllPackages ,createPackage, updatePackage,deletePackage,purchasePlan,checkPlanExpiration }