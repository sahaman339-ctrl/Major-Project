const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

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
router.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }),
);

//New Route
router.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//Show Route
router.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
  }),
);

//Create Route
router.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log(req.body);
    let newListing = new Listing(req.body.listing);
    // if (!newListing.title) {
    //   throw new ExpressError(400, "title is missing");
    // }
    // if (!newListing.description) {
    //   throw new ExpressError(400, "description is missing");
    // }
    // if (!newListing.location) {
    //   throw new ExpressError(400, "location is missing");
    // }
    // 2nd Method
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError(400, result.error)
    // }
    console.log(newListing);
    await newListing.save();
    // req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

//Edit Route
router.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  }),
);

//Update Route
router.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);

module.exports = router;
