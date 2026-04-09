const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ dest: storage });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/listings")
  .get(wrapAsync(listingController.index))
  // .post(
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing),
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });

//New Route
router.get("/listings/new", isLoggedIn, listingController.renderForm);

router
  .route("/listings/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  );
router.delete(
  "/listings/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destoryListing),
);

//Edit Route
router.get(
  "/listing/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

//Index Route
// router.get("/listings", wrapAsync(listingController.index));

//Show Route
// router.get("/listings/:id", wrapAsync(listingController.showListing));

// //Create Route
// router.post(
//   "/listings",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing),
// );

//Update Route
// router.put(
//   "/listings/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing),
// );

//Delete Route
// router.delete(
//   "/listing/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destoryListing),
// );

module.exports = router;
