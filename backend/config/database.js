//require("dotenv").config();
const { createPool } = require("mysql");

const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10
});

module.exports = pool;

// APP_PORT=3000
// DB_PORT=3306
// DB_HOST=localhost
// DB_USER=root
// DB_PASS=7LYnx7j&yYNuV@w
// MYSQL_DB=employeedb
// JWT_KEY=Aa@JWT123#
