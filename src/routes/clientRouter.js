const express = require("express");
const clientRouter = express.Router();
const clientController = require("../controllers/clientController");
const auth = require("../middlewares/authAssociate");

clientRouter.post("/newClient", auth, clientController.newClient);

clientRouter.get("/listAllClient", auth, clientController.listAllClient);

clientRouter.get("/searchClient/:cnpj", auth, clientController.searchClient);

clientRouter.put("/updateClient", auth, clientController.updateClient);

clientRouter.delete("/deleteClient/:id", auth, clientController.deleteClient);

module.exports = clientRouter;