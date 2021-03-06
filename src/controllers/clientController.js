const util = require("../util/functions");
const Sequelize = require("sequelize");
const Client = require("../models/Client");
const Associate = require("../models/Associate");

module.exports = {
    async newClient(req, res) {
        // Pegando as variaveis na requisição
        const { name, cnpj, address } = req.body;
        //Verificando se alguns dos campos estão vazios
        if (!name || !cnpj || !address) {
            return res.status(400).json({ msg: "Campos obrigatórios vazios" });
        }
        //Pegando o Associate ID
        const associateId = req.associateId;

        
        if (!util.cnpjValidation(cnpj)){
            return res.status(400).json({ msg: "CNPJ Inválido" })
        }

        const cnpjValidado = cnpj.replace(/[^\d]+/g, '');

        //Verificando se já existe um cliente
        try {
            const client = await Client.findOne({
                where: { cnpj: cnpjValidado },
            });
            //Se cliente for nullo retorna true, então verificar se ele retorna falso
            if (client) {
                return res.status(403).json({ msg: "Cliente já cadastrado" });
            } else {
                const cliente = await Client.create({
                    associateId,
                    name,
                    cnpj: cnpjValidado,
                    address,
                }).catch((error) => {
                    return res.status(500).json({ msg: "Não foi possível inserir os dados " + error });
                });
                if (cliente) {
                    return res.status(201).json({ msg: "Novo cliente adicionado com sucesso!" });
                } else {
                    return res.status(404).json({ msg: "Não foi possível cadastrar novo cliente!" });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async listAllClient(req, res) {
        const associateId = req.associateId;
        const clients = await Client.findAll({ where: { associateId } }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (clients) {
            if (clients == "") {
                return res.status(404).json({ msg: "Não foram encontrados Clientes cadastrados." });
            } else {
                return res.status(200).json(clients);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontrados Clientes cadastrados." });
        }
    },
    async searchClient(req, res) {
        //Localhost:3000/client/searchClient/1785679
        const associateId = req.associateId;
        const cnpj = req.params.cnpj;
        if (!cnpj) {
            res.status(400).json({
                msg: "Parâmetro cnpj está vazio.",
            });
        }
        const { Op } = require("sequelize");
        const client = await Client.findAll({
            where: {
                [Op.and]: [{ associateId }, { cnpj: { [Op.like]: "%" + cnpj + "%"} }]
            },
        });
        if (client) {
            if (client == "") {
                res.status(400).json({ msg: "Cliente não encontrado ou não está vinculado a este Associado." });
            } else {
                return res.status(200).json(client);
            }
        } else {
            res.status(400).json({ msg: "Cliente não encontrado ou não está vinculado a este Associado." });
        }
    },
    async updateClient(req, res) {
        const idAssociateLogin = req.associateId;

        const client = req.body;

        if (!client.id) {
            return res.status(400).json({ msg: "ID de cliente obrigatório no corpo da requisição" });
        }

        if (!util.cnpjValidation(client.cnpj) && client.cnpj){
            return res.status(400).json({ msg: "CNPJ Inválido" })
        }

        client.cnpj = client.cnpj.replace(/[^\d]+/g, '');

        const clientExists = await Client.findOne({
            where: { id: client.id }
        })
        if (!clientExists) {
            return res.status(400).json({ msg: "Cliente não encontrado" });
        } else {
            if (clientExists.associateId === idAssociateLogin) {
                if (client.cnpj && client.cnpj != clientExists.cnpj) {
                    const clientDuplicated = await Client.findOne({
                        where: { cnpj: client.cnpj }
                    })
                    if (clientDuplicated) {
                        return res.status(400).json({ msg: "CNPJ já usado por outro cliente" });
                    }
                }

            } else {
                return res.status(400).json({ msg: "Você não tem permissão para alterar os dados deste cliente pois ele não possui relação com associado logado" });
            }
        }
        if (client.name || client.cnpj || client.address) {
            await Client.update(client, {
                where: { id: client.id },
            });
            return res.status(200).json({ msg: "Cliente atualizado com sucesso!" });
        } else {
            return res.status(400).json({ msg: "Campos obrigatórios não preenchidos!" });
        }
    },

    async deleteClient(req, res) {
        //DELETANDO CLIENTE
        const clientId = req.params.id;
        const idAssociateLogin = req.associateId;

        if (!clientId) {
            return res.status(400).json({ msg: "ID de cliente obrigatório no corpo da requisição" });
        }

        const client = await Client.findOne({
            where: { id: clientId }
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        });

        if (client.associateId === idAssociateLogin) {
            const deletedClient = await Client.destroy({
                where: { id: clientId },
            }).catch((error) => {
                return res.status(500).json({ msg: "Falha na conexão " + error });
            })


            if (deletedClient != 0) {
                return res.status(200).json({ msg: "Cliente excluído com sucesso" });
            } else {
                return res.status(404).json({ msg: "Cliente não encontrado" });
            }
        }
    }
}