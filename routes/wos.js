const express = require("express");
const router = express.Router();
const wos_controller = require('../controllers/wos');


router.get("/export", wos_controller.export);

router.get("/paper/:id", wos_controller.paper);

router.get("/connection/:id", wos_controller.connection);

router.put("/correction", wos_controller.correction);

router.post("/parser", wos_controller.parser);

router.delete("/delete/:id", wos_controller.delete);

router.get("/status", wos_controller.status);


module.exports = router;