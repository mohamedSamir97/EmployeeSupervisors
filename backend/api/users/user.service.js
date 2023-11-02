const pool = require("../../config/database");

module.exports = {
  create: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
        [data.name, data.email, data.password, data.phone_number],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
  checkEmailExists: (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.length > 0);
          }
        }
      );
    });
  },
  getUserByUserEmail: (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  },

  getUserByUserId: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT id, name, email, password, phone_number FROM users WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  },

  getUsers: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT id, name, email, password, phone_number FROM users",
        [],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },

  updateUser: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE users SET name=?, email=?, password=?, phone_number=? WHERE id = ?",
        [data.name, data.email, data.password, data.phone_number, data.id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },

  deleteUser: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM users WHERE id = ?",
        [data.id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};
