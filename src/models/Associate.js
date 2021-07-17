const Sequelize = require("sequelize");

class Associate extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				cnpj: Sequelize.STRING,
				password: Sequelize.STRING,
                address: Sequelize.STRING,
			},
			{
				sequelize,
			}
		);
	}

    static associate(models) {
        this.hasMany(models.Delivery, { foreignKey: "associateId" }),
		this.hasMany(models.Client, { foreignKey: "associateId" })
    }
}

module.exports = Associate;