const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../joi");
const isloggedin=require("../isloggedin");

// validation
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

// INDEX
router.get("/", wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index", { alllistings });
}));

// NEW
router.get("/new",isloggedin, (req, res) => {
  res.render("listings/new");
});

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show", { listing1: listing });
}));

// CREATE
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);

  if (typeof newListing.image === "string") {
    newListing.image = {
      url: newListing.image,
      filename: "listing-image"
    };
  }
  
  await newListing.save();
  req.flash("success", "New Listing Added Successfully!");
  res.redirect(`/listings/${newListing._id}`);
}));

// EDIT
router.get("/:id/edit",isloggedin, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing1: listing });
}));

// UPDATE
router.put("/:id", validateListing,isloggedin, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
   req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id",isloggedin, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
   req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
}));

module.exports = router;