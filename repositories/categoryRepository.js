const { Category } = require("../models");

// CREATE a new category
const create = async (categoryData) => {
  return await Category.create(categoryData);
};

// READ all categories
const findAll = async () => {
  return await Category.findAll();
};

// READ by ID
const findById = async (id) => {
  return await Category.findByPk(id);
};

// UPDATE by ID
const update = async (id, updatedData) => {
  return await Category.update(updatedData, {
    where: { id },
  });
};

// DELETE by ID
const remove = async (id) => {
  return await Category.destroy({
    where: { id },
  });
};

// FIND by name
const findByName = async (name) => {
  return await Category.findOne({
    where: { name },
  });
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByName,
};
