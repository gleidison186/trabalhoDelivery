"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Deliveries", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      associateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: "Associates", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: "Clients", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      motoboyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: "Motoboys", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal(
					"CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
				),
			},
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Deliveries");
  },
};
