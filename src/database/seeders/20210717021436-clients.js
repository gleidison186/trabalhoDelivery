"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Clients",
      [
        {
          associateId: 1,
          name: "Julia",
          cnpj: "83859780000157",
          address: "Rua Tal",
        },
        {
          associateId: 2,
          name: "Victor",
          cnpj: "22744250000179",
          address: "Rua Tal",
        },
        {
          associateId: 3,
          name: "André",
          cnpj: "46282455000148",
          address: "Rua Tal",
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "Clients", null, {}
    )
  }
};
