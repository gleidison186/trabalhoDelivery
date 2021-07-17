const Sequelize = require("sequelize");

class Delivery extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				description: Sequelize.STRING,
				status: Sequelize.STRING,
				value: Sequelize.DECIMAL,
			},
			{
				sequelize,
			}
		);
	}

    static associate(models) {
        this.belongsTo(models.Associate, { foreignKey: "associateId" }),
        this.belongsTo(models.Client, { foreignKey: "clientId" }),
        this.belongsTo(models.Motoboy, { foreignKey: "motoboyId" })
    }
}

module.exports = Delivery;