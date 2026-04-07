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
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

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

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res, next) => {
  // next(new ExpressError(404, "Page not found!"));
  res.send("Hi, I am root.");
  // console.log(req.session);
});

app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(req.session.flash);
  // console.log(success);
  next();
});

app.get("/registerUser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });
  let newUser = await User.register(fakeUser, "helloworld");
  res.send(newUser);
});

app.use("/", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

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
