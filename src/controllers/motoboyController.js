const util = require("../util/functions");
const Motoboy = require("../models/Motoboy");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = {
    async authentication(req, res) {
        return res.status(200).json({ msg: "OK"});
    },

    async newMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async listAllMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async searchMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async updateMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async deleteMotoboy(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Lista de suas entregas realizadas
    async deliveriesMade(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Lista de suas entregas pendentes
    async pendingDeliveries(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    // Relatório financeiro retornando indicador do 
    // valor total em Reais cobrado nas entregas realizadas 
    // e sua porcentagem a ser paga (considerar 70% do valor da entrega)
    async financialReport(req, res){
        return res.status(200).json({ msg: "OK"});
    }
}