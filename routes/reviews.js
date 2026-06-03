const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const isLoggedIn = require("../isloggedin.js");
const { isReviewAuthor } = require("../isloggedin.js");

// ADD REVIEW
router.post("/",isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();

  listing.reviews.push(newReview);
  await listing.save();
 req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,
isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });
   req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;