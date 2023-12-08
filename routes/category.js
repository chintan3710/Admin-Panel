const express = require("express");

const categoryController = require("../controllers/categoryController");

const routes = express.Router();

routes.get("/add_category", categoryController.add_category);

routes.post("/insertCategoryData", categoryController.insertCategoryData);

routes.get("/view_category", categoryController.view_category);

routes.get("/activeCategory/:id", categoryController.activeCategory);

routes.get("/deActiveCategory/:id", categoryController.deActiveCategory);

routes.get("/deActiveCategory/:id", categoryController.deActiveCategory);

routes.get("/deleteCategory/:id", categoryController.deleteCategory);

routes.get("/updateCategory/:id", categoryController.updateCategory);

routes.post("/editCategoryData", categoryController.editCategoryData);

module.exports = routes;
