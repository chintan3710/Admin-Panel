const express = require("express");

const SubCategory = require("../models/subCategory");

const subCategoryController = require("../controllers/subCategoryController");

const routes = express.Router();

routes.get("/add_subCategory", subCategoryController.add_subCategory);

routes.post(
    "/insertCategoryData",
    SubCategory.subCategoryUploadImage,
    subCategoryController.insertCategoryData
);

routes.get("/view_subCategory", subCategoryController.view_subCategory);

routes.get("/activeSubCategory/:id", subCategoryController.activeSubCategory);

routes.get("/deActiveSubCategory/:id", subCategoryController.deActiveSubCategory);

routes.get("/deleteSubCategory/:id", subCategoryController.deleteSubCategory);

routes.get("/updateSubCategory/:id", subCategoryController.updateSubCategory);

routes.post(
    "/editSubCategoryData",
    SubCategory.subCategoryUploadImage,
    subCategoryController.editSubCategoryData
);

module.exports = routes;
