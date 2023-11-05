const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesHierarchy,
  checkNameExists,
  getEmployeePotentialSupervisors,
  assignSupervisorToEmp,
} = require("./employee.controller");

router.get("/", checkToken, getEmployees);
router.post("/checkname", checkToken, checkNameExists);
router.post("/getPotentialSupervisors", checkToken, getEmployeePotentialSupervisors);
router.post("/assignSupervisorToEmp", checkToken, assignSupervisorToEmp);
router.get("/gethierarchy", checkToken, getEmployeesHierarchy);
router.post("/", checkToken, createEmployee);
router.get("/:id", checkToken, getEmployeeById);
router.patch("/", checkToken, updateEmployee);
router.post("/delete", checkToken, deleteEmployee);


module.exports = router;
