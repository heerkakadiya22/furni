const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");
const { roleValidation } = require("../validators/rolesValidator");

// API endpoints
router.get("/roles", protect, roleController.renderRoleListPage);
router.get("/getroles", protect, roleController.getAllRoles);
router.get("/addrole", protect, roleController.renderRoleForm);
router.post("/addrole", protect, roleValidation, roleController.createRole);
router.get("/roles/:id/edit", protect, roleController.renderRoleForm);
router.post("/roles/:id/edit", protect, roleValidation, roleController.updateRole);
router.delete("/roles/:id", protect, roleController.deleteRole);

module.exports = router;
