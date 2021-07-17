require("dotenv").config();

console.log("Host: " + process.env.DB_SERVER)
console.log("Porta: " + process.env.DB_PORT)
console.log("Usename: " + process.env.DB_USER)
console.log("Password: " + process.env.DB_PASSWORD)
console.log("Database: " + process.env.DB_NAME)

module.exports = {
	dialect: "mysql",
	host: process.env.DB_SERVER,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	timezone: "-03:00",
	define: {
		timestamp: true,
	},
};