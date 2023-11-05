const {
  create,
  checkEmailExists,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

// Create a function to validate required fields
const validateRequiredFields = (body, res) => {
  if (!body.name || !body.email || !body.password || !body.phone_number) {
    res.status(400).json({
      success: 0,
      error: "Missing or invalid data",
    });
    return true; // Validation failed
  }
  return false; // Validation succeeded
};

module.exports = {
  createUser: async (req, res) => {
    const body = req.body;

    // Check if the request body is empty
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: 0,
        error: "Request body is empty",
      });
    }

    if (validateRequiredFields(body, res)) {
        return;
      }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    try {
      const emailExists = await checkEmailExists(body.email);

      if (emailExists) {
        return res.status(400).json({
          success: 0,
          error: "Email address is already in use",
        });
      }

      // Email is not in use; proceed with user creation
      await create(body);

      return res.status(200).json({
        success: 1,
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
  },
  login: async (req, res) => {
    const body = req.body;

    try {
      const results = await getUserByUserEmail(body.email);

      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }

      const result = compareSync(body.password, results.password);

      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "24h",
        });

        return res.json({
          success: 1,
          message: "Login successful",
          user: {
            name: results.name,
            token: jsontoken,
          },

        });
      } else {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "An error occurred",
      });
    }
  },

  getUserByUserId: async (req, res) => {
    const id = req.params.id;

    try {
      const results = await getUserByUserId(id);

      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }

      results.password = undefined;
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

  getUsers: async (req, res) => {
    try {
      const results = await getUsers();

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

  updateUsers: async (req, res) => {
    const body = req.body;

    if (validateRequiredFields(body, res)) {
      return;
    }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    if (!body.id) {
      return res.status(400).json({
        success: 0,
        message: "id is missing!"
      });
    }

    try {
      await updateUser(body);
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

  deleteUser: async (req, res) => {
    const data = req.body;

    try {
      const results = await deleteUser(data);

      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }

      return res.json({
        success: 1,
        message: "User deleted successfully",
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
