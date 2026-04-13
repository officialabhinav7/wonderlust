const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const ExpressError = require("./utils/expressError");
const wrapAsync = require("./utils/wrapAsync");
const Joi = require("joi");
const { listingSchema } = require("./joi");
const Listing = require("./models/listing");
const Review = require("./models/review");
 const session = require("express-session");
const flash = require("connect-flash");
//flash middleware


sessionconfig={
    secret:"secretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionconfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});



// 🔥 ROUTES
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");

// =================== CONFIG ===================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =================== DB ===================

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
  console.log("Connected to MongoDB");
}

main()
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// =================== ROUTES ===================

app.get("/", (req, res) => {
  res.send("Hello World");
});

// 🔥 USE ROUTERS
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// =================== ERROR HANDLING ===================

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Final error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error", { err }); // better practice
});

// =================== SERVER ===================

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});