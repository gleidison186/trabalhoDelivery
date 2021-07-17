const express = require("express");
const associateRouter = require("./associateRouter");
const clientRouter = require("./clientRouter");
const deliveryRouter = require("./deliveryRouter");
const motoboyRouter = require("./motoboyRouter");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("It's working");
});

router.use("/associate", associateRouter);
router.use("/client", clientRouter);
router.use("/motoboy", motoboyRouter);
router.use("/delivery", deliveryRouter);

module.exports = router;