const addressRepository = require("../repositories/addressRepository");

exports.renderAddressPage = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const savedAddresses = await addressRepository.findAllByUser(userId);

    const editId = req.query.editId || null;
    let editAddress = null;

    if (editId) {
      const addr = await addressRepository.findById(editId);
      if (addr && addr.user_id === userId) {
        editAddress = addr;
      }
    }

    const success = req.session.success || "";
    const error = req.session.error || "";
    req.session.success = null;
    req.session.error = null;

    res.render("user-address", {
      title: editId ? "Edit Address" : "Manage Addresses",
      currentPage: "user-address",
      csrfToken: req.csrfToken(),
      user_id: userId,
      session: req.session,
      addresses: savedAddresses,
      success,
      error,
      editAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    const {
      id,
      name,
      number,
      no,
      street,
      city,
      state,
      zipCode,
      landMark,
      country,
      type,
      isDefault,
    } = req.body;

    if (
      !name ||
      !number ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      req.session.error = "Please fill in all required fields before saving.";
      return res.redirect("/user-address");
    }

    const addressData = {
      fullName: name.trim(),
      number: number.trim(),
      no: no?.trim() || "",
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      landMark: landMark?.trim() || "",
      country: country.trim(),
      type: type?.trim() || "Home",
      isDefault: !!isDefault,
      user_id: userId,
    };

    if (id && id.trim() !== "") {
      const existing = await addressRepository.findById(id);
      if (!existing || existing.user_id !== userId) {
        req.session.error = "Address not found or unauthorized.";
        return res.redirect("/user-address");
      }

      await addressRepository.update(id, addressData);
      req.session.success = "Address updated successfully.";
    } else {
      await addressRepository.create(addressData);
      req.session.success = "Address added successfully.";
    }

    req.session.save(() => {
      return res.redirect("/user-address");
    });
  } catch (error) {
    console.error("Error saving address:", error);
    req.session.error = "Something went wrong while saving address.";
    res.redirect("/user-address");
  }
};

exports.deleteAddress = async (req, res) => {
  const id = (req.params.id || "").trim();

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Address ID is required" });
  }

  try {
    const existing = await addressRepository.findById(id);

    if (!existing || existing.user_id !== req.session.user?.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await addressRepository.delete(id);

    return res.json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error(
      `Error deleting address (UserID: ${req.session.user?.id}):`,
      err
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
