const Sequelize = require("sequelize");

class Client extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				cnpj: Sequelize.STRING,
                address: Sequelize.STRING,
			},
			{
				sequelize,
			}
		);
	}

    static associate(models) {
		this.belongsTo(models.Associate, { foreignKey: "associateId" }),
        this.hasMany(models.Delivery, { foreignKey: "clientId" })
    }
}

module.exports = Client;