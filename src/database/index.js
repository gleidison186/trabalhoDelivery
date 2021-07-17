const Sequelize = require("sequelize");
const dbConfig = require("./config/dbconfig");

const Associate = require("../models/Associate");
const Client = require("../models/Client");
const Motoboy = require("../models/Motoboy");
const Delivery = require("../models/Delivery");

const connection = new Sequelize(dbConfig);

Associate.init(connection);
Client.init(connection);
Motoboy.init(connection);
Delivery.init(connection);

Associate.associate(connection.models);
Client.associate(connection.models);
Motoboy.associate(connection.models);
Delivery.associate(connection.models);

module.exports = connection;