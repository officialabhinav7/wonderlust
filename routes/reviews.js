const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const isLoggedIn = require("../isloggedin.js");
const { isReviewAuthor } = require("../isloggedin.js");
const reviewsCollection = require("../collections/reviews");

// ADD REVIEW
router.post("/",isLoggedIn, wrapAsync(async (req, res) => {
  const newReview = await reviewsCollection.addReview(req.params.id, req.body.review, req.user._id);
  req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,
isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await reviewsCollection.deleteReview(id, reviewId);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;