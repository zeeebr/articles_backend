const express = require("express");
const router = express.Router();
const scopus_controller = require('../controllers/scopus');


router.get("/export", scopus_controller.export);

router.get("/paper/:id", scopus_controller.paper);

router.get("/connection/:id", scopus_controller.connection);

router.put("/correction", scopus_controller.correction);

router.post("/parser",  scopus_controller.parser);

router.delete("/delete/:id", scopus_controller.delete);

router.get("/status", scopus_controller.status);


module.exports = router;