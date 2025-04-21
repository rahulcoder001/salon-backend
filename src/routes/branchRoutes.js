const express = require("express");
const { IsBranch, addbrnch, updatebranch } = require("../controllers/branchControllers");


const router = express.Router();

router.post("/create", addbrnch);
router.post("/isbranch", IsBranch);
router.put("/update/:id",updatebranch)


module.exports = router;
