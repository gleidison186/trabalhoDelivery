"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Todas as senhas são: 1234Abcd!
    return queryInterface.bulkInsert(
      "Motoboys",
      [
        {
          associateId: 1,
          name: "Mario",
          cpf: "71117565092",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          phone: "123456789",
        },
        {
          associateId: 2,
          name: "Marcio",
          cpf: "00107098008",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          phone: "123456789",
        },
        {
          associateId: 3,
          name: "Franciele",
          cpf: "07506088037",
          password: "$2a$12$Gpv0AN5mpbEksvmD/mpU6OKzrD6RgltGtmW2rumP16s8y6KQkMHfG",
          phone: "123456789",
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "Motoboys", null, {}
    )
  }
};
