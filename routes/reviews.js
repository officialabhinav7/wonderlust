const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// ADD REVIEW
router.post("/", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.review);
  await newReview.save();

  listing.reviews.push(newReview);
  await listing.save();
 req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW
router.delete("/:reviewid", wrapAsync(async (req, res) => {
  const { id, reviewid } = req.params;

  await Review.findByIdAndDelete(reviewid);

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewid }
  });
   req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;