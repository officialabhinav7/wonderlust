const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");

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
const createListing = async (listingData, userId, file) => {

    const newListing = new Listing(listingData);

    newListing.image = {
        url: file.path,
        filename: file.filename
    };

    newListing.owner = userId;

    await newListing.save();

    return newListing;
};

// Update listing by ID
const updateListing = async (id, updateData, file) => {
    let listing = await Listing.findById(id);
    
    // If a new image file is provided, update it
    if (file) {
        // Delete old image from Cloudinary if it exists
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        
        // Update with new image
        listing.image = {
            url: file.path,
            filename: file.filename
        };
    }
    
    // Update other listing data
    Object.assign(listing, updateData);
    
    return await listing.save();
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
