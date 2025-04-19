const express = require("express");
const { addBranch, IsBranch } = require("../controllers/branchControllers");


const router = express.Router();

router.post("/create", addBranch);
router.post("/isbranch", IsBranch);


module.exports = router;
