const Sequelize = require("sequelize");

module.exports = {
    async newClient(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async listAllClient(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async searchClient(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async updateClient(req, res){
        return res.status(200).json({ msg: "OK"});
    },

    async deleteClient(req, res){
        return res.status(200).json({ msg: "OK"});
    }
}