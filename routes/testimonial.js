const express = require("express");

const routes = express.Router();

const testimonialController = require("../controllers/testimonialController");

routes.get("/add_testimonial", testimonialController.add_testimonial);

routes.post(
    "/insertTestimonialData",
    testimonialController.insertTestimonialData
);

routes.get("/view_testimonial", testimonialController.view_testimonial);

routes.get("/activeTestimonial/:id", testimonialController.activeTestimonial);

routes.get("/deActiveTestimonial/:id", testimonialController.deActiveTestimonial);

routes.get("/deleteTestimonial/:id", testimonialController.deleteTestimonial);

routes.get("/updateTestimonial/:id", testimonialController.updateTestimonial);

routes.post("/editTestimonialData", testimonialController.editTestimonialData);

module.exports = routes;
