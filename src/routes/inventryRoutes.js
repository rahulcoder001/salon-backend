const express = require("express");
const { SaveProduct, saveService, UpdateProduct, DeleteProduct, updateService } = require("../controllers/inventryControllers");



const router = express.Router();

router.post("/saveproduct", SaveProduct);
router.post("/saveservice",saveService)
router.put("/updateproduct/:id",UpdateProduct)
router.delete("/deleteproduct/:id",DeleteProduct)
router.put('/updateservices/:id', updateService);


 
module.exports = router;
