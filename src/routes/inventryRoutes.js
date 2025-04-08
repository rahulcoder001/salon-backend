const express = require("express");
const { SaveProduct, saveService } = require("../controllers/inventryControllers");



const router = express.Router();

router.post("/saveproduct", SaveProduct);
router.post("/saveservice",saveService)

 
module.exports = router;
