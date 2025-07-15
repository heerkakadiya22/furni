const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

// API endpoints
router.get("/roles", roleController.renderRoleListPage);
router.get("/getroles/api", roleController.getAllRoles);
router.get("/addrole", roleController.renderRoleForm);
router.post("/addrole", roleController.createRole);
router.get("/roles/:id/edit", roleController.renderRoleForm);
router.post("/roles/:id/edit", roleController.updateRole);
router.delete("/roles/:id", roleController.deleteRole);

module.exports = router;
