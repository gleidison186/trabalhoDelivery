const util = require("../util/functions");
const Sequelize = require("sequelize");
const Associate = require("../models/Associate");
const Client = require("../models/Client")
const Delivery = require("../models/Delivery")
const Motoboy = require("../models/Motoboy")
const bcrypt = require("bcryptjs");

module.exports = {
    async authentication(req, res) {
        const cnpj = req.body.cnpj;
        const password = req.body.password;
        if (!cnpj || !password) {
            return res.status(400).json({ msg: "Campos obrigatórios vazios" });
        }
        try {
            const associate = await Associate.findOne({
                where: { cnpj },
            });
            if (!associate) {
                return res.status(404).json({ msg: "Usuário ou senha inválidos" });
            } else {
                if (bcrypt.compareSync(password, associate.password)) {
                    const token = util.generateToken(associate.id, "associate")
                    return res.status(200).json({ msg: "Autenticado com sucesso", token });
                } else {
                    return res.status(404).json({ msg: "Usuário ou senha inválidos" });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async newAssociate(req, res) {
        const { name, cnpj, password, address } = req.body;
        if (!name || !cnpj || !password) {
            return res.status(400).json({ msg: "Dados obrigatórios não foram preenchidos." })
        }

        const passwordValid = util.passwordValidation(password);

        if (passwordValid !== "OK") {
            return res.status(400).json({ msg: passwordValid });
        }

        const isAssociateNew = await Associate.findOne({
            where: { cnpj },
        });

        if (isAssociateNew) {
            return res.status(403).json({ msg: "Associado já cadastrado" });
        } else {
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(password, salt);
            const associate = await Associate.create({
                name,
                cnpj,
                password: hash,
                address,
            }).catch((error) => {
                return res
                    .status(500)
                    .json({ msg: "Não foi possível inserir os dados " + error });
            });
            if (associate) {
                return res.status(201).json({ msg: "Novo associado adicionado" });
            } else {
                return res.status(404).json({ msg: "Não foi possível cadastrar novo associado" })
            }
        }
    },

    async listAllAssociate(req, res) {
        const associates = await Associate.findAll().catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (associates) {
            if (associates == "") {
                return res.status(404).json({ msg: "Não foram encontrados associados." });
            } else {
                return res.status(200).json(associates);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontrados associados." });
        }
    },

    async searchAssociate(req, res) {
        const associateCnpj = req.params.cnpj;
        if (!associateCnpj || associateCnpj === "") {
            return res.status(400).json({ msg: "CNPJ do associado vazio" });
        } else {
            const associate = await Associate.findOne({
                where: { cnpj: associateCnpj }
            })
            if (!associate) {
                return res.status(400).json({ msg: "Associado não encontrado" });
            } else {
                return res.status(200).json(associate)
            }
        }
    },

    async updateAssociate(req, res) {
        const associate = req.body;
        const associateExists = await Associate.findByPk(associate.id);
        if (!associateExists) {
            return res.status(400).json({ msg: "Associado não encontrado" });
        } else {
            if (associate.cnpj) {
                const associateDuplicated = await Associate.findOne({
                    where: { cnpj: associate.cnpj }
                })
                console.log(associateDuplicated)
                if (associateDuplicated) {
                    return res.status(400).json({ msg: "CNPJ já usado por outro associado" });
                }
            }
            if (associate.password) {
                const passwordValid = util.passwordValidation(associate.password);
                if (passwordValid !== "OK") {
                    return res.status(400).json({ msg: passwordValid });
                }
                const salt = bcrypt.genSaltSync(12);
                const hash = bcrypt.hashSync(associate.password, salt);
                associate.password = hash;
            }
            if (associate.name || associate.cnpj || associate.password || associate.address) {
                await Associate.update(associate, {
                    where: { id: associate.id }
                })
                return res.status(200).json({ msg: "Associado atualizado com sucesso" });
            } else {
                return res.status(400).json({ msg: "Campos obrigatórios não preenchidos." });
            }
        }
    },

    async deleteAssociate(req, res) {
        const associateId = req.params.id;
        const deletedAssociate = await Associate.destroy({
            where: { id: associateId },
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })

        if (deletedAssociate != 0) {
            res.status(200).json({ msg: "Associado excluído com sucesso" });
        } else {
            res.status(404).json({ msg: "Associado não encontrado" });
        }
    },

    // REALTÓRIOS DO ASSOCIADO

    // Relatório administrativo retornando à quantidade total de clientes, motoboys e entregas cadastradas
    async generalReport(req, res) {
        const totalClients = await Client.count({
            where: { associateId: req.associateId }
        })
        const totalDeliveries = await Delivery.count({
            where: { associateId: req.associateId }
        })
        const totalMotoboys = await Motoboy.count({
            where: { associateId: req.associateId }
        })
        return res.status(200).json({ totalClients, totalDeliveries, totalMotoboys });
    },

    // Top 5 clientes que solicitaram mais entregas
    async topFiveClients(req, res) {
        const topClients = await Client.findAll({
            attributes: ['name', 'cnpj'],
            where: { associateId: req.associateId },
            include: {
                model: Delivery,
                attributes: ['clientId', [Sequelize.fn('COUNT', Sequelize.col('clientId')), 'Entregas'],],
                group: 'clientId',
                order: [
                    'Entregas', 'DESC'
                ],
            },
            limit: 5
        })
        return res.status(200).json({ topClients });
    },

    // Top 5  motoboys  que  realizaram  mais  entregas
    async topFiveMotoboys(req, res) {
        const topMotoboys = await Motoboy.findAll({
            attributes: ['name', 'cpf'],
            where: { associateId: req.associateId },
            include: {
                model: Delivery,
                attributes: ['motoboyId', [Sequelize.fn('COUNT', Sequelize.col('motoboyId')), 'Entregas'],],
                group: 'motoboyId',
                order: [
                    'Entregas', 'DESC'
                ],
            },
            limit: 5
        })
        return res.status(200).json({ topMotoboys });
    },

    // Porcentagem  de  entregas realizadas  até  o  momento
    async deliveriesMade(req, res) {
        const deliveries = await Delivery.count({
            where: { associateId: req.associateId }
        })
        const { Op } = require("sequelize");
        const deliveriesM = await Delivery.count({
            where: { 
                [Op.and]: [{ associateId: req.associateId }, { status: "Realizada" }]
            }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (deliveriesM) {
            if (deliveriesM == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                const percent = (deliveriesM * 100) / deliveries;
                return res.status(200).json({percent});
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },

    // Porcentagem  de  entregas  pendentes  até  o momento
    async pendingDeliveries(req, res) {
        const deliveries = await Delivery.count({
            where: { associateId: req.associateId }
        })
        const { Op } = require("sequelize");
        const pDeliveries = await Delivery.count({
            where: { 
                [Op.and]: [{ associateId: req.associateId }, { status: "Pendente" }]
            }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (pDeliveries) {
            if (pDeliveries == "") {
                return res.status(404).json({ msg: "Não foram encontradas entregas." });
            } else {
                const percent = (pDeliveries * 100) / deliveries;
                return res.status(200).json({percent});
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontradas entregas." });
        }
    },

    // Relatório financeiro retornando indicador do valor total em Reais 
    // cobrado nas entregas realizadas, a porcentagem a ser paga para os 
    // motoboys (considerar 70% do valor da entrega) e a porcentagem do 
    // associado (considerar 30% do valor da entrega).
    async financialReport(req, res) {
        const { Op } = require("sequelize");
        const totalValue = await Delivery.sum('value', {
            [Op.and]: [{ associateId: req.associateId }, { status: "Realizada" }]
        })
        const motoboyValue = totalValue * 0.7;
        const associateValue = totalValue * 0.3;
        return res.status(200).json({ totalValue, motoboyValue, associateValue });
    },
}