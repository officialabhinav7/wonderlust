const Review = require("../models/review");
const Listing = require("../models/listing");

// Add review to a listing
const addReview = async (listingId, reviewData, userId) => {
    const listing = await Listing.findById(listingId);
    
    const newReview = new Review(reviewData);
    newReview.author = userId;
    await newReview.save();
    
    listing.reviews.push(newReview);
    await listing.save();
    
    return newReview;
};

// Delete review from a listing
const deleteReview = async (listingId, reviewId) => {
    await Review.findByIdAndDelete(reviewId);
    
    await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId }
    });
};

module.exports = {
    addReview,
    deleteReview
};
