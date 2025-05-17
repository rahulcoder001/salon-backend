const prisma = require("../config/db");
const Razorpay = require('razorpay');
const cron = require('node-cron');
const dayjs = require('dayjs');
const { Prisma } = require("@prisma/client");
const crypto = require('crypto');
// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "",
  key_secret: ""
});

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

// 3. Update Package with Razorpay Integration
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isUnlimitedBranches, ...updateData } = req.body;

    // Handle branch limit conversion if needed
    if (typeof isUnlimitedBranches !== 'undefined') {
      updateData.branchLimit = isUnlimitedBranches ? 9999 : updateData.branchLimit;
    }

    // First update the package in database
    const updatedPackage = await prisma.subscriptionPackage.update({
      where: { id },
      data: updateData,
      include: {
        PurchasedPlan: true,
        activeUsers: true
      }
    });

    // If price was updated, create a Razorpay plan
    if (updateData.price !== undefined) {
      try {
        // Create a Razorpay plan (for recurring subscriptions)
        const razorpayPlan = await razorpay.plans.create({
          period: 'monthly',
          interval: 1,
          item: {
            name: updatedPackage.name,
            amount: updatedPackage.price * 100,
            currency: 'INR',
            description: updatedPackage.description
          },
          notes: {
            packageId: updatedPackage.id
          }
        });

        // Update package with Razorpay plan ID
        await prisma.subscriptionPackage.update({
          where: { id },
          data: {
            razorpayPlanId: razorpayPlan.id
          }
        });
      } catch (razorpayError) {
        console.error('Razorpay plan creation failed:', razorpayError);
        // Continue even if Razorpay plan creation fails
      }
    }

    res.status(200).json({ 
      success: true, 
      data: updatedPackage 
    });
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

    const existingPackage = await prisma.subscriptionPackage.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Delete associated Razorpay plan if exists
    if (existingPackage.razorpayPlanId) {
      try {
        await razorpay.plans.delete(existingPackage.razorpayPlanId);
      } catch (razorpayError) {
        console.error('Failed to delete Razorpay plan:', razorpayError);
      }
    }

    await prisma.subscriptionPackage.delete({
      where: { id }
    });

    res.status(200).json({ 
      success: true, 
      message: "Package deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};

// 5. Purchase Plan with Razorpay Integration
// In your pakageController.js
const purchasePlan = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    // Validate input
    if (!userId || !packageId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId or packageId"
      });
    }

    // Get package details with price validation
    const package = await prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
      select: { price: true, name: true }
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Handle free plan immediately
    if (package.price === 0) {
      const [user, plan] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { activePlanId: packageId }
        }),
        prisma.purchasedPlan.create({
          data: {
            userId,
            packageId,
            paymentDetails: "Free plan activation"
          }
        })
      ]);

      return res.json({
        success: true,
        data: { user, plan }
      });
    }

    // Validate minimum amount for Razorpay
    if (package.price < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount too low for payment processing",
        minimum: "₹1.00"
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: package.price * 100, // Convert to paise
      currency: "INR",
      notes: { userId, packageId }
    });

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment processing failed",
      errorCode: error.error?.code
    });
  }
};

// 6. Verify Payment and Activate Plan
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Check all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all payment information',
        missing_fields: {
          order_id: !razorpay_order_id,
          payment_id: !razorpay_payment_id,
          signature: !razorpay_signature
        }
      });
    }

    // 2. Verify the signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        details: 'Invalid digital signature'
      });
    }

    // 3. Fetch order details
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, packageId } = order.notes;

    // 4. Check user and package validity
    const [userExists, packageExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.subscriptionPackage.findUnique({ where: { id: packageId } })
    ]);

    if (!userExists || !packageExists) {
      return res.status(404).json({
        success: false,
        message: 'User or package not found',
        details: userExists ? 'Package not found' : 'User not found'
      });
    }

    // 5. Start the transaction
    const transaction = await prisma.$transaction([
      // Update user
      prisma.user.update({
        where: { id: userId },
        data: { activePlanId: packageId }
      }),
      
      // Create purchased plan (according to updated schema)
      prisma.purchasedPlan.create({
        data: {
          userId,
          packageId,
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          paymentDetails: JSON.stringify(order)
        }
      })
    ]);

    // 6. Send success response
    res.status(200).json({
      success: true,
      message: 'Payment successfully verified',
      data: {
        user: { id: transaction[0].id, plan: transaction[0].activePlanId },
        payment: { id: transaction[1].id, package: packageExists.name }
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Specific error handling
    let errorMessage = 'Internal server error';
    if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = 'Database schema inconsistency error';
    } else if (error.message.includes('Razorpay')) {
      errorMessage = 'Failed to connect with the payment provider';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      technical_details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// 7. Check Plan Expiration (cron job)
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

// 8. Get Package by ID
const getpackagesbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const package = await prisma.subscriptionPackage.findUnique({
      where: { id },
      include: {
        PurchasedPlan: true,
        activeUsers: true
      }
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  purchasePlan,
  verifyPayment,
  checkPlanExpiration,
  getpackagesbyid
};