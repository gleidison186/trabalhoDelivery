const express = require("express");
const deliveryRouter = express.Router();
const deliveryController = require("../controllers/deliveryController");
const auth = require("../middlewares/authAssociate");

deliveryRouter.post("/newDelivery", auth, deliveryController.newDelivery);

deliveryRouter.get("/listAllDelivery", auth, deliveryController.listAllDelivery);

deliveryRouter.get("/searchDelivery", auth, deliveryController.searchDelivery);

deliveryRouter.get("/searchDeliveryByMotoboy/:cpf", auth, deliveryController.searchDeliveryByMotoboy);

deliveryRouter.put("/updateDelivery/:id", auth, deliveryController.updateDelivery);

deliveryRouter.delete("/deleteDelivery/:id", auth, deliveryController.deleteDelivery);

deliveryRouter.get("/deliveriesMade", auth, deliveryController.deliveriesMade);

deliveryRouter.get("/pendingDeliveries", auth, deliveryController.pendingDeliveries);

module.exports = deliveryRouter;