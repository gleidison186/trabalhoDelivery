"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Deliveries",
      [
        {
          associateId: 1,
          clientId: 1,
          motoboyId: 1,
          description: "Entrega de Alimento",
          status: "Pendente"
        },
        {
          associateId: 2,
          clientId: 2,
          motoboyId: 2,
          description: "Entrega de Alimento",
          status: "Pendente"
        },
        {
          associateId: 2,
          clientId: 2,
          motoboyId: 2,
          description: "Entrega de Alimento",
          status: "Pendente"
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "Deliveries", null, {}
    )
  }
};
