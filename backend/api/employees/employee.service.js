const pool = require("../../config/database");

function returnCreatedEmp(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT
          e.id AS id,
          e.name AS name,
          s.name AS supervisor,
          e.supervisor_id
          FROM employees e
          LEFT JOIN employees s ON e.supervisor_id = s.id WHERE e.id = ?`,
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
}

module.exports = {
  getEmployeeById: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
            e.id AS id,
            e.name AS name,
            s.name AS supervisor,
            e.supervisor_id
            FROM employees e
            LEFT JOIN employees s ON e.supervisor_id = s.id WHERE e.id = ?`,
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
  create: (data) => {
    return new Promise((resolve, reject) => {
      if (data.isSeniorSupervisor) {
        // If it's a senior supervisor, first insert the employee
        pool.query(
          "INSERT INTO employees (name, supervisor_id) VALUES (?, NULL)",
          [data.name],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              const emp_id = results.insertId;

              // Find the senior supervisor with supervisor_id = 0
              pool.query(
                "SELECT id FROM employees WHERE supervisor_id = 0",
                (error, results) => {
                  if (error) {
                    reject(error);
                  }
                  if (results.length > 0) {
                    const seniorSupervisorId = results[0].id;

                    // Update employees with supervisor_id = old seniorSupervisorId
                    pool.query(
                      "UPDATE employees SET supervisor_id = ? WHERE supervisor_id = ?",
                      [emp_id, seniorSupervisorId],
                      (error) => {
                        if (error) {
                          reject(error);
                        }

                        // Update the new employee's supervisor_id to 0
                        pool.query(
                          "UPDATE employees SET supervisor_id = 0 WHERE id = ?",
                          [emp_id],
                          (error) => {
                            if (error) {
                              reject(error);
                            }
                            //set old senior supervisor_id to NULL
                            pool.query(
                              "UPDATE employees SET supervisor_id = NULL WHERE id = ?",
                              [seniorSupervisorId],
                              (error) => {
                                if (error) {
                                  reject(error);
                                }

                                // Get the newly added employee by their ID
                                returnCreatedEmp(emp_id)
                                  .then((newEmployee) => {
                                    resolve(newEmployee);
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              }
                            );
                          }
                        );
                      }
                    );
                  } else {
                    //no senior supervisor set the current as senior
                    pool.query(
                      "UPDATE employees SET supervisor_id = 0 WHERE id = ?",
                      [emp_id],
                      (error) => {
                        if (error) {
                          reject(error);
                        }

                        // Get the newly added employee by their ID
                        returnCreatedEmp(emp_id)
                          .then((newEmployee) => {
                            resolve(newEmployee);
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        // If it's not a senior supervisor, insert the employee with the given supervisor_id
        pool.query(
          "INSERT INTO employees (name, supervisor_id) VALUES (?, NULL)",
          [data.name],
          (error, results) => {
            if (error) {
              reject(error);
            }
            const emp_id = results.insertId;
            // Get the newly added employee by their ID
            returnCreatedEmp(emp_id)
              .then((newEmployee) => {
                resolve(newEmployee);
              })
              .catch((err) => {
                reject(err);
              });
          }
        );
      }
    });
  },

  checkNameExists: (name) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT name FROM employees WHERE name = ?",
        [name],
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

  getEmployees: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
            e.id AS id,
            e.name AS name,
            s.name AS supervisor,
            e.supervisor_id
            FROM employees e
            LEFT JOIN employees s ON e.supervisor_id = s.id;`,
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

  updateEmployee: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE employees SET name=?, supervisor_id=? WHERE id = ?",
        [data.name, data.supervisor_id, data.id],
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

  deleteEmployee: (emp_id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const employeeIdToDelete = emp_id;

        connection.beginTransaction((beginErr) => {
          if (beginErr) {
            connection.release();
            reject(beginErr);
            return;
          }

          connection.query(
            "SELECT supervisor_id FROM employees WHERE id = ?",
            [employeeIdToDelete],
            (selectErr, results) => {
              if (selectErr) {
                connection.rollback(() => {
                  connection.release();
                  reject(selectErr);
                });
                return;
              }

              if (results.length === 0) {
                connection.rollback(() => {
                  connection.release();
                  reject("Employee not found");
                });
                return;
              }

              const supervisorId = results[0].supervisor_id;

              connection.query(
                "UPDATE employees SET supervisor_id = NULL WHERE supervisor_id = ?",
                [employeeIdToDelete],
                (updateErr) => {
                  if (updateErr) {
                    connection.rollback(() => {
                      connection.release();
                      reject(updateErr);
                    });
                    return;
                  }

                  connection.query(
                    "DELETE FROM employees WHERE id = ?",
                    [employeeIdToDelete],
                    (deleteErr, deleteResults) => {
                      if (deleteErr) {
                        connection.rollback(() => {
                          connection.release();
                          reject(deleteErr);
                        });
                      } else {
                        connection.commit((commitErr) => {
                          if (commitErr) {
                            connection.rollback(() => {
                              connection.release();
                              reject(commitErr);
                            });
                          } else {
                            connection.release();
                            resolve(deleteResults);
                          }
                        });
                      }
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  },

  getEmployeesHierarchy: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT id, name, supervisor_id FROM employees ORDER BY id",

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
  getPotentialSupervisors: (emp_Id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, name,supervisor_id FROM employees
         WHERE id != ? `,
         //AND ( supervisor_id != ? OR supervisor_id IS null)
        [emp_Id],
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

  assignSupervisor: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE employees SET  supervisor_id=? WHERE id = ?",
        [data.supervisor_id, data.id],
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
