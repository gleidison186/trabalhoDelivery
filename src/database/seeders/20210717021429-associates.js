"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Todas as senhas são: 1234Abcd!
    return queryInterface.bulkInsert(
      "Associates",
      [
        {
          name: "João",
          cnpj: "83859780000157",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          address: "",
        },
        {
          name: "Maria",
          cnpj: "22744250000179",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          address: "",
        },
        {
          name: "Ana",
          cnpj: "46282455000148",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          address: "",
        },
        {
          name: "Alex",
          cnpj: "65485350000130",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          address: "",
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "Associates", null, {}
    )
  }
};
