const {
  create,
  checkNameExists,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeesHierarchy,
  getPotentialSupervisors,
  assignSupervisor,
} = require("./employee.service");

// Create a function to validate required fields
const validateRequiredFields = (body, res) => {
  if (!body.name) {
    res.status(400).json({
      success: 0,
      message: "Missing or invalid data",
    });
    return true; // Validation failed
  }
  return false; // Validation succeeded
};

module.exports = {
  createEmployee: async (req, res) => {
    const body = req.body;

    // Check if the request body is empty
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: 0,
        message: "Request body is empty",
      });
    }

    if (validateRequiredFields(body, res)) {
      return;
    }

    try {
      const nameExists = await checkNameExists(body.name);

      if (nameExists) {
        return res.status(400).json({
          success: 0,
          message: "Name is already in use",
        });
      }

      // Name is not in use; proceed with employee creation
      let results = await create(body);

      return res.status(200).json({
        success: 1,
        message: "Employee created successfully",
        data: results,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  checkNameExists: async (req, res) => {
    const body = req.body;

    // Check if the request body is empty
    if (!body.name) {
      return res.status(400).json({
        success: 0,
        message: "Name is required",
      });
    }

    try {
      const nameExists = await checkNameExists(body.name);

      if (nameExists) {
        return res.status(200).json({
          success: 0,
          message: "Name is already in use",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Available name",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
  },

  getEmployeeById: async (req, res) => {
    const id = req.params.id;

    try {
      const results = await getEmployeeById(id);

      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }

      return res.json({
        success: 1,
        data: results,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  getEmployees: async (req, res) => {
    try {
      const results = await getEmployees();

      return res.json({
        success: 1,
        data: results,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred: " + err,
      });
    }
  },

  updateEmployee: async (req, res) => {
    const body = req.body;

    if (validateRequiredFields(body, res)) {
      return;
    }

    if (!body.id) {
      return res.status(400).json({
        success: 0,
        message: "id is missing!",
      });
    }

    try {
      await updateEmployee(body);
      return res.json({
        success: 1,
        message: "Updated successfully",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  deleteEmployee: async (req, res) => {
    const body = req.body;

    if (!body.id) {
      return res.status(400).json({
        success: 0,
        message: "id is missing!",
      });
    }

    try {
      const results = await deleteEmployee(body.id);

      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }

      return res.json({
        success: 1,
        message: "Employee deleted successfully",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  getEmployeesHierarchy: async (req, res) => {
    try {
      const results = await getEmployeesHierarchy();

      return res.json({
        success: 1,
        data: results,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  getEmployeePotentialSupervisors: async (req, res) => {
    try {
      const body = req.body;
      const emp_id = body.id;
      // Check if the request body is empty
      if (!emp_id) {
        return res.status(400).json({
          success: 0,
          message: "No employee id found!",
        });
      }

      const results = await getPotentialSupervisors(emp_id);

      if (results.length > 0) {
        return res.json({
          success: 1,
          data: results,
        });
      } else {
        return res.json({
          success: 0,
          data: [{ id: "-1", name: "No supervisor available" }],
          message: 'No supervisor available'
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred: " + err,
      });
    }
  },

  assignSupervisorToEmp: async (req, res) => {
    const body = req.body;

    if (!body.id && !body.supervisor_id) {
      return res.status(400).json({
        success: 0,
        message: "id or supervisor_id is missing!",
      });
    }

    try {
      const results = await assignSupervisor(body);

      return res.json({
        success: 1,
        message: "Supervisor assigned successfully",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },
};
