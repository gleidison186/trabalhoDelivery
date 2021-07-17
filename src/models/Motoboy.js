const Sequelize = require("sequelize");

class Motoboy extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				cpf: Sequelize.STRING,
				password: Sequelize.STRING,
                phone: Sequelize.STRING,
			},
			{
				sequelize,
			}
		);
	}

    static associate(models) {
        this.hasMany(models.Delivery, { foreignKey: "motoboyId" })
    }
}

module.exports = Motoboy;