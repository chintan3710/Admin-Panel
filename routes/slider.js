const express = require("express");

const Slider = require("../models/slider");

const sliderController = require("../controllers/sliderController");

const routes = express.Router();

routes.get("/add_slider", sliderController.add_slider);

routes.post(
    "/insertSliderData",
    Slider.sliderUploadImage,
    sliderController.insertSliderData
);

routes.get("/view_slider", sliderController.view_slider);

routes.get("/activeSlider/:id", sliderController.activeSlider);

routes.get("/deActiveSlider/:id", sliderController.deActiveSlider);

routes.get("/deleteSlider/:id", sliderController.deleteSlider);

routes.get("/updateSlider/:id", sliderController.updateSlider);

routes.post(
    "/editSliderData",
    Slider.sliderUploadImage,
    sliderController.editSliderData
);

module.exports = routes;
