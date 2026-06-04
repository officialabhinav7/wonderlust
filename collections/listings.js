const Listing = require("../models/listing");

// Get all listings
const getAllListings = async () => {
    return await Listing.find({});
};

// Get listing by ID with populated references
const getListingById = async (id) => {
    return await Listing.findById(id)
        .populate("owner")
        .populate("reviews");
};

// Create new listing
const createListing = async (listingData, userId) => {
    const newListing = new Listing(listingData);
    
    // Handle image format
    if (typeof newListing.image === "string") {
        newListing.image = {
            url: newListing.image,
            filename: "listing-image"
        };
    }
    
    newListing.owner = userId;
    await newListing.save();
    return newListing;
};

// Update listing by ID
const updateListing = async (id, updateData) => {
    return await Listing.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete listing by ID
const deleteListing = async (id) => {
    return await Listing.findByIdAndDelete(id);
};

module.exports = {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing
};
