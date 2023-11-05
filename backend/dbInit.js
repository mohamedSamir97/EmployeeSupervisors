const mysql = require("mysql");
const { hashSync, genSaltSync } = require("bcrypt");
/**
 * create database and tables and admin if not exists
 */
function initializeDatabase() {
  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    //database: process.env.MYSQL_DB,
    connectionLimit: 10,
  };

  const connection = mysql.createConnection(dbConfig);

  // Create the database if not exists
  connection.query("CREATE DATABASE IF NOT EXISTS employeedb", (err) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created or already exists");
      // After the database is created or if it already exists, connect to it
      dbConfig.database = "employeedb";
      initializeTablesAndAdmin();
    }
  });

  function initializeTablesAndAdmin() {
    const connection = mysql.createConnection(dbConfig);

    // Create the "users" table if not exists
    connection.query(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20)
      )`,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err);
        } else {
          console.log("Users table created or already exists");
        }
      }
    );

    // Create the "employees" table if not exists
    connection.query(
      `
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name  VARCHAR(255) UNIQUE NOT NULL,
        supervisor_id INT
      )`,
      (err) => {
        if (err) {
          console.error("Error creating employees table:", err);
        } else {
          console.log("Employees table created or already exists");
        }
      }
    );

    // Check if the admin email already exists
    connection.query(
      "SELECT email FROM users WHERE email = ?",
      ["admin@test.test"], // Replace with the admin email you want to check
      (emailCheckErr, emailResults) => {
        if (emailCheckErr) {
          console.error("Error checking for admin email:", emailCheckErr);
          connection.end();
          return;
        }

        // If the admin email does not exist, create the admin user
        if (emailResults.length === 0) {
          createAdminUser(connection);
        } else {
          console.log("Admin user already exists");
          connection.end();
        }
      }
    );
  }

  function createAdminUser(connection) {
    const salt = genSaltSync(10);
    const adminUser = {
      name: "Admin Mohamed",
      email: "admin@test.test",
      password: hashSync("admin", salt),
      phone_number: "123456789",
    };

    connection.query(
      "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
      [
        adminUser.name,
        adminUser.email,
        adminUser.password,
        adminUser.phone_number,
      ],
      (err, results) => {
        if (err) {
          console.error("Error creating admin user:", err);
        } else {
          console.log("Admin user created");
        }
        connection.end();
      }
    );
  }
}

module.exports = initializeDatabase;
