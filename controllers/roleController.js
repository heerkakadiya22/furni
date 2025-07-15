const roleRepository = require("../repositories/roleRepository");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleRepository.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error while fetching roles." });
  }
};

exports.renderRoleListPage = (req, res) => {
  try {
    res.render("rolelist", {
      title: "Role List",
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

    if (roleId) {
      role = await roleRepository.findById(roleId);
      if (!role) {
        req.session.error = "Role not found.";
        return res.redirect("/roles");
      }
    }

    res.render("roleform", {
      title: role ? "Edit Role" : "Add Role",
      currentPage: "roles",
      role,
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
  try {
    const { name, description } = req.body;
    const active = req.body.active ? true : false;

    if (!name) {
      req.session.error = "Role name is required.";
      return res.redirect("/addrole");
    }

    await roleRepository.create({
      rolename: name,
      description,
      active,
    });

    res.redirect("/roles");
  } catch (error) {
    console.error("Error creating role:", error);
    req.session.error = "Server error while creating role.";
    res.redirect("/addrole");
  }
};

// Handle Role Update
exports.updateRole = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    const active = req.body.active ? true : false;

    if (!name) {
      req.session.error = "Role name is required.";
      return res.redirect(`/roles/${id}/edit`);
    }

    const updated = await roleRepository.update(id, {
      rolename: name,
      description,
      active,
    });

    if (!updated) {
      req.session.error = "Failed to update role.";
      return res.redirect("/roles");
    }

    res.redirect("/roles");
  } catch (error) {
    console.error("Error updating role:", error);
    req.session.error = "Server error while updating role.";
    res.redirect(`/roles/${req.body.id}/edit`);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    console.log("🔍 Delete Request for ID:", roleId); // ✅ log the ID

    const deleted = await roleRepository.delete(roleId);
    console.log("🗑 Deleted Count:", deleted); // ✅ log result

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
