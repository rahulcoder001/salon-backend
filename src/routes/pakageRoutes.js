const express = require("express");
const { 
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  purchasePlan,
  getpackagesbyid,
  verifyPayment
} = require("../controllers/pakageController");

const router = express.Router();

// Get all packages
router.get('/getall', getAllPackages);

// Get single package by ID
router.get('/:id', getpackagesbyid);

// Create new package
router.post('/add', createPackage);

// Update package
router.put('/update/:id', updatePackage);

// Delete package
router.delete('/delete/:id', deletePackage);

// Purchase plan
router.post("/buy", purchasePlan);

// Verify payment
router.post("/verify-payment", verifyPayment);

module.exports = router;