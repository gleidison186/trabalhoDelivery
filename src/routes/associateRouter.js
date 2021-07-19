const express = require("express");
const associateRouter = express.Router();
const associateController = require("../controllers/associateController");
const auth = require("../middlewares/authAssociate");

associateRouter.post("/authentication", associateController.authentication);

associateRouter.post("/newAssociate", associateController.newAssociate);

associateRouter.get("/listAllAssociate", auth, associateController.listAllAssociate);

associateRouter.get("/searchAssociate/:cnpj", associateController.searchAssociate);

associateRouter.put("/updateAssociate", auth, associateController.updateAssociate);

associateRouter.delete("/deleteAssociate/:id", auth, associateController.deleteAssociate);

associateRouter.get("/generalReport", auth, associateController.generalReport);

associateRouter.get("/topFiveClients", auth, associateController.topFiveClients);

associateRouter.get("/topFiveMotoboys", auth, associateController.topFiveMotoboys);

associateRouter.get("/deliveriesMade", auth, associateController.deliveriesMade);

associateRouter.get("/pendingDeliveries", auth, associateController.pendingDeliveries);

associateRouter.get("/financialReport", auth, associateController.financialReport);

module.exports = associateRouter;