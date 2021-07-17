const util = require("../util/functions");
const Sequelize = require("sequelize");
const Associate = require("../models/Associate");
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
                    const token = util.generateToken(associate.id)
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
        return res.status(200).json({ msg: "OK" });
    },

    async updateAssociate(req, res) {
        return res.status(200).json({ msg: "OK" });
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

    // Relatório administrativoretornando à quantidade total de clientes, motoboys e entregas cadastradas
    async generalReport(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    // Top 5 clientes que solicitaram mais entregas
    async topFiveClients(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    // Top 5  motoboys  que  realizaram  mais  entregas
    async topFiveMotoboys(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    // Porcentagem  de  entregas realizadas  até  o  momento
    async deliveriesMade(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    // Porcentagem  de  entregas  pendentes  até  o momento
    async pendingDeliveries(req, res) {
        return res.status(200).json({ msg: "OK" });
    },

    // Relatório financeiro retornando indicador do valor total em Reais 
    // cobradonas entregas realizadas, a porcentagem a ser paga para os 
    // motoboys (considerar 70% do valor da entrega) e a porcentagem do 
    // associado (considerar 30% do valor da entrega).
    async financialReport(req, res) {
        return res.status(200).json({ msg: "OK" });
    },
}