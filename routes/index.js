const express = require("express");
const router = express.Router();
const index_controller = require('../controllers/index');


router.get("/count", index_controller.count);

router.put("/eids", index_controller.eids);


module.exports = router;