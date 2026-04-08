const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//Index Route
router.get("/listings", wrapAsync(listingController.index));

//New Route
router.get("/listings/new", isLoggedIn, listingController.renderForm);

//Show Route
router.get("/listings/:id", wrapAsync(listingController.showListing));

//Create Route
router.post(
  "/listings",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing),
);

//Edit Route
router.get(
  "/listing/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

//Update Route
router.put(
  "/listings/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);

//Delete Route
router.delete(
  "/listing/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destoryListing),
);

module.exports = router;
