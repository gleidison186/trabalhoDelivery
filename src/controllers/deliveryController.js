const Delivery = require("../models/Delivery");
const Sequelize = require("sequelize");

module.exports = {
    async newDelivery(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async listAllDelivery(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async searchDelivery(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async searchDeliveryByMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Somente entregas pendentes são atualizadas
    async updateDelivery(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Somente entregas pendentes são removidas
    async deleteDelivery(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Lista de entregas realizadas
    async deliveriesMade(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Lista de entregas pendentes
    async pendingDeliveries(req, res){
        return res.status(200).json({ msg: "OK"});
    },
}