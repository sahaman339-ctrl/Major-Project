const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(8080, () => {
  console.log("app is listening to port 8080");
  // console.log(express);
  // console.log(app);
});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
  // res.send("Hi, I am root.");
});

app.use("/", listings);
app.use("/listings/:id/reviews", reviews);

// //Delete middleware for reviews
// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

//Error handling MiddleWare
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// app.get("/testListing", (req, res) => {
//   let sampleListing = new Listing({
//     title: "Tropical Pop Studio Fast Wifi Balcony TV SofaBed",
//     description: "Worries free",
//     price: 5000,
//     location: "Pune City",
//     country: "India",
//   });
//   sampleListing.save();
//   console.log(sampleListing);
//   res.send("testing successful");
// });
