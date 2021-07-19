const Delivery = require("../models/Delivery");
const Motoboy = require("../models/Motoboy");
const Client = require("../models/Client");
const Sequelize = require("sequelize");


module.exports = {
    async newDelivery(req, res) {
        const { clientId, motoboyId, description, value } = req.body;
        const associateId = req.associateId;
        const status = "Pendente";
        if (!clientId || !motoboyId || !description || !value) {
            return res.status(400).json({ msg: "Dados obrigatórios não foram preenchidos." });
        }

        const { Op } = require("sequelize");
        const motoboyExists = await Motoboy.findOne({
            where: {  [Op.and]: [{ associateId: req.associateId }, { id:  motoboyId }] }
        });

        if (!motoboyExists) {
            return res.status(400).json({ msg: "Motoboy não encontrado" });
        }

        const clientExists = await Client.findOne({
            where: {  [Op.and]: [{ associateId: req.associateId }, { id:  clientId }] }
        })

        if (!clientExists) {
            return res.status(400).json({ msg: "Cliente não encontrado" });
        }

        const delivery = await Delivery.create({
            associateId,
            clientId,
            motoboyId,
            description,
            status,
            value
        }).catch((error) => {
            return res.status(500).json({ msg: "Não foi possível inserir os dados " + error })
        })

        if (delivery) {
            return res.status(201).json({ msg: "Nova entrega adicionada" })
        } else {
            return res.status(404).json({ msg: "Não foi possível cadastrar nova entrega" })
        }
    },

    async listAllDelivery(req, res) {
        const deliveries = await Delivery.findAll({
            where: { associateId: req.associateId }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (deliveries) {
            if (deliveries == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                return res.status(200).json(deliveries);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },

    async searchDelivery(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    async searchDeliveryByMotoboy(req, res) {
        const motoboyId = req.params.id;
        if (!motoboyId) {
            return res.status(400).json({ msg: "ID do motoboy obrigatório" })
        }
        const { Op } = require("sequelize");
        const deliveries = await Delivery.findAll({
            where: {
                [Op.and]: [{ associateId: req.associateId }, { motoboyId }]
            }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (deliveries) {
            if (deliveries == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                return res.status(200).json(deliveries);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },

    // Somente entregas pendentes são atualizadas
    async updateDelivery(req, res) {
        const delivery = req.body;
        if (!delivery.id) {
            return res.status(400).json({ msg: "Dados obrigatórios não preenchidos." })
        }
        const { Op } = require("sequelize");
        let pkId;
        if (req.associateId) {
            pkId = { associateId: req.associateId }
        } else {
            pkId = { motoboyId: req.motoboyId }
        }
        const deliveryExists = await Delivery.findOne({
            where: {
                [Op.and]: [{ id: delivery.id }, { status: "Pendente" }, pkId]
            }
        })
        if (!deliveryExists) {
            return res.status(400).json({ msg: "Entrega não encontrada." });
        } else {
            delivery.status = "Realizada";
            await Delivery.update(delivery, {
                where: { id: delivery.id }
            })
            return res.status(200).json({ msg: "Entrega atualizada com sucesso" });
        }
    },

    // Somente entregas pendentes são removidas
    async deleteDelivery(req, res) {
        const deliveryId = req.params.id;
        const { Op } = require("sequelize");
        const deliveryExists = await Delivery.findOne({
            where: {
                [Op.and]: [{ id: deliveryId }, { status: "Pendente" }, { associateId: req.associateId }]
            }
        })
        if (!deliveryExists) {
            return res.status(400).json({ msg: "Entrega não encontrada, está finalizada ou pertence a outro associado." });
        }
        const deleteDelivery = Delivery.destroy({
            where: { id: deliveryId }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão. " + error })
        })

        if (deleteDelivery != 0) {
            return res.status(200).json({ msg: "Entrega Excluída com Sucesso" })
        } else {
            return res.status(404).json({ msg: "Entrega não encontrada" })
        }
    },

    // Lista de entregas realizadas
    async deliveriesMade(req, res) {
        const { Op } = require("sequelize");
        const deliveries = await Delivery.findAll({
            where: {
                [Op.and]: [{ associateId: req.associateId }, { status: "Realizada" }]
            }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (deliveries) {
            if (deliveries == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                return res.status(200).json(deliveries);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },

    // Lista de entregas pendentes
    async pendingDeliveries(req, res) {
        const { Op } = require("sequelize");
        const deliveries = await Delivery.findAll({
            where: {
                [Op.and]: [{ associateId: req.associateId }, { status: "Pendente" }]
            }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (deliveries) {
            if (deliveries == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                return res.status(200).json(deliveries);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },
}