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
    const updateData = req.body;

    const updatedPackage = await prisma.subscriptionPackage.update({
      where: { id },
      data: updateData,
      include: {
        PurchasedPlan: true,
        activeUsers: true
      }
    });

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

    await prisma.subscriptionPackage.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Package deleted successfully"
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Package not found or delete failed",
      error: error.message
    });
  }
};

module.exports = {getAllPackages ,createPackage, updatePackage,deletePackage }