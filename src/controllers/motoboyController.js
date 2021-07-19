const util = require("../util/functions");
const Motoboy = require("../models/Motoboy");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const Delivery = require("../models/Delivery");

module.exports = {
    async authentication(req, res) {
        const cpf = req.body.cpf;
        const password = req.body.password;
        if (!cpf || !password) {
            return res.status(400).json({ msg: "Campos obrigatórios vazios" });
        }
        try {
            const motoboy = await Motoboy.findOne({
                where: { cpf },
            });
            if (!motoboy) {
                return res.status(404).json({ msg: "Usuário ou senha inválidos" });
            } else {
                if (bcrypt.compareSync(password, motoboy.password)) {
                    const token = util.generateToken(motoboy.id, "motoboy");
                    return res.status(200).json({ msg: "Autenticado com sucesso", token });
                } else {
                    return res.status(404).json({ msg: "Usuário ou senha inválidos" });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async newMotoboy(req, res){
        const idAssociateLogin = req.associateId;

        const { name, cpf, password, phone } = req.body;
        if (!name || !cpf || !password) {
            return res.status(400).json({ msg: "Dados obrigatórios não foram preenchidos." })
        }

        const passwordValid = util.passwordValidation(password);

        if (passwordValid !== "OK") {
            return res.status(400).json({ msg: passwordValid });
        }

        const isMotoboyNew = await Motoboy.findOne({
            where: { cpf },
        });

        if (isMotoboyNew) {
            return res.status(403).json({ msg: "Motoboy já cadastrado" });
        } else {
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(password, salt);
            const motoboy = await Motoboy.create({
                associateId: idAssociateLogin,
                name,
                cpf,
                password: hash,
                phone,
            }).catch((error) => {
                return res
                    .status(500)
                    .json({ msg: "Não foi possível inserir os dados " + error });
            });
            if (motoboy) {
                return res.status(201).json({ msg: "Novo motoboy adicionado" });
            } else {
                return res.status(404).json({ msg: "Não foi possível cadastrar novo motoboy" })
            }
        }
    },

    async listAllMotoboy(req, res){
        const idAssociateLogin = req.associateId;

        const motoboys = await Motoboy.findAll({
            where: { associateId: idAssociateLogin }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (motoboys) {
            if (motoboys == "") {
                return res.status(404).json({ msg: "Não foram encontrados motoboys." });
            } else {
                return res.status(200).json(motoboys);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontrados motoboys." });
        }
    },

    async searchMotoboy(req, res){
        const idAssociateLogin = req.associateId;

        const motoboyCPF = req.params.cpf;
        if (!motoboyCPF || motoboyCPF === "") {
            return res.status(400).json({ msg: "CPF do motoboy vazio" });
        } else {
            const motoboy = await Motoboy.findOne({
                where: { cpf: motoboyCPF }
            })
            if (!motoboy) {
                return res.status(400).json({ msg: "Motoboy não encontrado" });
            } else {
                if(motoboy.associateId == idAssociateLogin){
                    return res.status(200).json(motoboy)
                }else{
                    return res.status(400).json({ msg: "Você não tem permissão para acessar os dados deste motoboy pois ele não possui relação com associado logado" });
                }
            }
        }
    },

    async updateMotoboy(req, res){
        const idAssociateLogin = req.associateId;

        const motoboy = req.body;
        const idMotoboyAlterado = req.params.id
        const motoboyExists = await Motoboy.findOne({
                where: { id: idMotoboyAlterado }
        });
        if (!motoboyExists) {
            return res.status(400).json({ msg: "Motoboy não encontrado" });
        } else {
            if(motoboyExists.associateId == idAssociateLogin){
                if (motoboy.cpf && motoboy.cpf !== motoboyExists.cpf) {
                    const motoboyDuplicated = await Motoboy.findOne({
                        where: { cpf: motoboy.cpf }
                    })
                    //console.log(motoboyDuplicated)
                    if (motoboyDuplicated) {
                        return res.status(400).json({ msg: "CPF já usado por outro motoboy" });
                    }
                }//
                if (motoboy.password) {
                    const passwordValid = util.passwordValidation(motoboy.password);
                    if (passwordValid !== "OK") {
                        return res.status(400).json({ msg: passwordValid });
                    }
                    const salt = bcrypt.genSaltSync(12);
                    const hash = bcrypt.hashSync(motoboy.password, salt);
                    motoboy.password = hash;
                }
                if (motoboy.name || motoboy.cpf || motoboy.password || motoboy.phone) {
                    await Motoboy.update(motoboy, {
                        where: { id: motoboyExists.id }
                    })
                    return res.status(200).json({ msg: "Motoboy atualizado com sucesso" });
                } else {
                    return res.status(400).json({ msg: "Campos obrigatórios não preenchidos." });
                }
            }else{
                return res.status(400).json({ msg: "Você não tem permissão para alterar os dados deste motoboy pois ele não possui relação com associado logado" });
            }
        }
    },

    async deleteMotoboy(req, res){
        const idAssociateLogin = req.associateId;

        const motoboyId = req.params.id;

        const motoboy = await Delivery.findOne({
            where: { id: motoboyId }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        });

        if(motoboy.associateId == idAssociateLogin){
            const deletedMotoboy = await Motoboy.destroy({
                where: { id: motoboyId, associateId: idAssociateLogin },
            }).catch((error) => {
                return res.status(500).json({ msg: "Falha na conexão " + error });
            })
    
            if (deletedMotoboy != 0) {
                return res.status(200).json({ msg: "Motoboy excluído com sucesso" });
            } else {
                return res.status(404).json({ msg: "Motoboy não encontrado" });
            }
        }else{
            return res.status(404).json({ msg: "Você não tem permissão para excluir este motoboy" });
        }

    },

    // Lista de suas entregas realizadas
    async deliveriesMade(req, res){
        const idMotoboyLogin = req.motoboyId;

        const { Op } = require("sequelize");
        const deliveries = await Delivery.findAll({
            where: { 
                [Op.and]: [{motoboyId: idMotoboyLogin}, { status: "Realizada" }]
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

    // Lista de suas entregas pendentes
    async pendingDeliveries(req, res){
        const idMotoboyLogin = req.motoboyId;

        const { Op } = require("sequelize");
        const deliveries = await Delivery.findAll({
            where: { 
                [Op.and]: [{motoboyId: idMotoboyLogin}, { status: "Pendente" }]
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

    // Relatório financeiro retornando indicador do 
    // valor total em Reais cobrado nas entregas realizadas 
    // e sua porcentagem a ser paga (considerar 70% do valor da entrega)
    async financialReport(req, res){
        const { Op } = require("sequelize");
        const totalValue = await Delivery.sum('value', {
            [Op.and]: [{ motoboyId: req.motoboyId }, { status: "Realizada" }]
        })
        const motoboyValue = totalValue * 0.7;
        return res.status(200).json({ "ValorTotal": totalValue, "ValorMotoboy": motoboyValue});
    }
}