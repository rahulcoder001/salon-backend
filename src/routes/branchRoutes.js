const express = require("express");
const { addBranch } = require("../controllers/branchControllers");


const router = express.Router();

router.post("/create", addBranch);

 
module.exports = router;
