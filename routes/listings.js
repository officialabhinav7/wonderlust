const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../joi");
const isLoggedIn = require("../isloggedin.js");
const { isOwner } = require("../isloggedin.js");
const listingsCollection = require("../collections/listings");

// validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

// INDEX
router.get("/", wrapAsync(async (req, res) => {
  const alllistings = await listingsCollection.getAllListings();
  res.render("listings/index", { alllistings });
}));

// NEW
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await listingsCollection.getListingById(req.params.id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show", { listing: listing });
}));

// CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = await listingsCollection.createListing(
      req.body.listing,
      req.user._id,
      req.file
    );

    req.flash("success", "New Listing Added Successfully!");
    res.redirect(`/listings/${newListing._id}`);
  })
);

// EDIT
router.get("/:id/edit" ,isLoggedIn,
isOwner, wrapAsync(async (req, res) => {
  const listing = await listingsCollection.getListingById(req.params.id);
  res.render("listings/edit", { listing: listing });
}));

// UPDATE
router.put("/:id", validateListing,isLoggedIn,isOwner, upload.single("listing[image]"), wrapAsync(async (req, res) => {
  await listingsCollection.updateListing(req.params.id, req.body.listing,req.file);
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  await listingsCollection.deleteListing(req.params.id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
}));

module.exports = router;