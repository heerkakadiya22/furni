const roleRepository = require("../repositories/roleRepository");
const authRepository = require("../repositories/authRepository");
const { validationResult } = require("express-validator");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleRepository.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error while fetching roles." });
  }
};

exports.renderRoleListPage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);
    res.render("rolelist", {
      ...user.dataValues,
      breadcrumbs: [{ label: "Home", url: "/dashboard" }, { label: "Roles" }],
      currentPage: "roles",
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering role list page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderRoleForm = async (req, res) => {
  try {
    const roleId = req.params.id;
    let role = null;

    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);

    if (roleId) {
      role = await roleRepository.findById(roleId);
      if (!role) {
        req.session.error = "Role not found.";
        req.session.save(() => {
          return res.redirect("/roles");
        });
      }
    }

    const breadcrumbs = [
      { label: "Home", url: "/dashboard" },
      { label: "Roles", url: "/roles" },
      { label: role ? "Edit Role" : "Add Role" },
    ];

    res.render("roleform", {
      ...user.dataValues,
      title: role ? "Edit Role" : "Add Role",
      currentPage: "roles",
      role,
      breadcrumbs,
      error: req.session.error || null,
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });

    req.session.error = null;
  } catch (error) {
    console.error("Error rendering role form:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.createRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return req.session.save(() => res.redirect("/addrole"));
  }

  try {
    const { name, description } = req.body;
    const active = req.body.active ? true : false;

    if (!name) {
      req.session.error = "Role name is required.";
      return req.session.save(() => res.redirect("/addrole"));
    }

    // 🔍 Check for duplicate role
    const existingRole = await roleRepository.findByName(name);
    if (existingRole) {
      req.session.error = "Role name already exists.";
      return req.session.save(() => res.redirect("/addrole"));
    }

    await roleRepository.create({
      rolename: name,
      description,
      active,
    });

    req.session.save(() => {
      return res.redirect("/roles");
    });
  } catch (error) {
    console.error("Error creating role:", error);
    req.session.error = "Server error while creating role.";
    req.session.save(() => {
      return res.redirect("/addrole");
    });
  }
};

// Handle Role Update
exports.updateRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return req.session.save(() => res.redirect(`/roles/${req.body.id}/edit`));
  }
  try {
    const { id, name, description } = req.body;
    const active = req.body.active ? true : false;

    if (!name) {
      req.session.error = "Role name is required.";
      req.session.save(() => {
        return res.redirect(`/roles/${id}/edit`);
      });
    }

    const updated = await roleRepository.update(id, {
      rolename: name,
      description,
      active,
    });

    if (!updated) {
      req.session.error = "Failed to update role.";
      req.session.save(() => {
        return res.redirect("/roles");
      });
    }

    req.session.save(() => {
      return res.redirect("/roles");
    });
  } catch (error) {
    console.error("Error updating role:", error);
    req.session.error = "Server error while updating role.";
    req.session.save(() => {
      return res.redirect(`/roles/${req.body.id}/edit`);
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    console.log("🔍 Delete Request for ID:", roleId);

    const deleted = await roleRepository.delete(roleId);
    console.log("🗑 Deleted Count:", deleted);

    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "Role deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Role not found." });
    }
  } catch (error) {
    console.error("❌ Error deleting role:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
