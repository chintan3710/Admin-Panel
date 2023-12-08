const express = require("express");

const routes = express.Router();

const offerController = require("../controllers/offerController");

routes.get("/add_offer", offerController.add_offer);

routes.post("/insertOfferData", offerController.insertOfferData);

routes.get("/view_offer", offerController.view_offer);

routes.get("/activeOffer/:id", offerController.activeOffer);

routes.get("/deActiveOffer/:id", offerController.deActiveOffer);

routes.get("/deleteOffer/:id", offerController.deleteOffer);

routes.get("/updateOffer/:id", offerController.updateOffer);

routes.post("/editOfferData", offerController.editOfferData);

module.exports = routes;
