const express = require("express");
const motoboyRouter = express.Router();
const motoboyController = require("../controllers/motoboyController");
const deliveryController = require("../controllers/deliveryController")
const authAssociate = require("../middlewares/authAssociate");
const authMotoboy = require("../middlewares/authMotoboy");

motoboyRouter.post("/authentication", motoboyController.authentication);

motoboyRouter.post("/newMotoboy", authAssociate, motoboyController.newMotoboy);

motoboyRouter.get("/listAllMotoboy", authAssociate, motoboyController.listAllMotoboy);

motoboyRouter.get("/searchMotoboy/:cpf", authAssociate, motoboyController.searchMotoboy);

motoboyRouter.put("/updateMotoboy", authAssociate, motoboyController.updateMotoboy);

motoboyRouter.delete("/deleteMotoboy/:id", authAssociate, motoboyController.deleteMotoboy);

motoboyRouter.get("/deliveriesMade", authMotoboy, motoboyController.deliveriesMade);

motoboyRouter.get("/pendingDeliveries", authMotoboy, motoboyController.pendingDeliveries);

motoboyRouter.put("/updateDelivery", authMotoboy, deliveryController.updateDelivery);

motoboyRouter.get("/financialReport", authMotoboy, motoboyController.financialReport);

module.exports = motoboyRouter;