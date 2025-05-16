const express = require("express");
const { getAllPackages, createPackage, updatePackage, deletePackage, purchasePlan } = require("../controllers/pakageController");


const router = express.Router();

router.get('/getall', getAllPackages);

// POST /packages
router.post('/add', createPackage);

// PUT /packages/:id
router.put('/update/:id', updatePackage);

// DELETE /packages/:id
router.delete('/delete/:id', deletePackage);

router.post("/buy",purchasePlan)
 
module.exports = router;