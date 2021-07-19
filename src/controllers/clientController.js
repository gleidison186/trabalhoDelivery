const util = require("../util/functions");
const Sequelize = require("sequelize");
const Client = require("../models/Client");
const Associate = require("../models/Associate");

module.exports = {
    async newClient(req, res){
        // Pegando as variaveis na requisição
        const { name, cnpj, address } = req.body;
        //Verificando se alguns dos campos estão vazios
        if (!name || !cnpj || !address){
            return res.status(400).json({ msg: "Campos obrigatórios vazios" });
        }
        //Pegando o Associate ID
        const associateId = req.associateId;

        //Verificando se já existe um cliente
        try {
            const client = await Client.findOne({
                where: { cnpj },
            });
            //Se cliente for nullo retorna true, então verificar se ele retorna falso
            if (client) {
                return res.status(403).json({ msg: "Cliente já cadastrado" });
            } else {
                const cliente = await Client.create({
                    associateId,
                    name,
                    cnpj,
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
    },async listAllClient(req, res){
        const associateId = req.associateId;
        const clients = await Client.findAll({ where:{associateId}}).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão " + error });
        })
        if (clients){
            if (clients == ""){
                return res.status(404).json({ msg: "Não foram encontrados Clientes cadastrados." });
            } else {
                return res.status(200).json(clients);
            }
        } else {
            return res.status(404).json({ msg: "Não foram encontrados Clientes cadastrados." });
        }
    },async searchClient(req,res){
        //Localhost:3000/client/searchClient/1785679
        const associateId = req.associateId;
        const cnpj = req.params.cnpj;
        console.log("ESTA MERDA TA AQUI" + cnpj);
        if(!cnpj){
            res.status(400).json({
                msg: "Parâmetro cnpj está vazio.",
            });
        }
        const Op = Sequelize.Op;
        const client = await Client.findAll({
            where: { cnpj: { [Op.like]: "%" + cnpj + "%"}, 
                     associateId: { [Op.like]: "%" + associateId + "%"}
                   },
        });
        console.log(client);
        if(client){
            if(client == ""){
                res.status(400).json({ msg:"Client não encontrado ou não está vinculado a este Associado."});
            }else{
                return res.status(200).json(client);
            }
        }
    },async updateClient(req, res){
        const clientName = req.body.name;
        const clientCnpj = req.body.cnpj;
        const clientAddress = req.body.address;

        const client = req.body;
        if(!clientCnpj){
            res.status(400).json({msg:"ID do client vazio."});
        }else{
            if(clientName && clientCnpj && clientAddress){
                await Client.update(client, {
                    where: {cnpj: clientCnpj},
                });
            return res.status(200).json({ msg: "Client atualizado com sucesso!" });
            }else{
                return res.status(400).json({ msg: "Campos obrigatórios não preenchidos!" });
            }
        }
    },async deleteClient(req, res){
        //DELETANDO CLIENTE
        const clientId = req.params.id;
        const clientDeleted = await Client.destroy({
            where: {id: clientId},
        }).catch(async (error)=>{
            const associateHasRef = await Associate.findOne({
                where: {clientId}
            }).catch((error)=>{
                res.status(500).json({ msg:"Falha na conexão!"});
            });
            if(associateHasRef)
                return res.status(403).json({msg:"Cliente não possui associado em seu nome."});
        });
        if(clientDeleted != 0){
            res.status(200).json({ msg: "Removido com sucesso!" });
        }
        else{
            res.status(404).json({ msg: "Cliente não encontrado." });
        }
    }
}