// Import Cloudinary v2 package
const cloudinary = require("cloudinary").v2;

// Import CloudinaryStorage class
// This connects Multer directly to Cloudinary
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Configure Cloudinary using credentials stored in .env
cloudinary.config({

    // Your Cloudinary account name
    cloud_name: process.env.CLOUD_NAME,

    // Your API key
    api_key: process.env.CLOUD_API_KEY,

    // Your API secret
    api_secret: process.env.CLOUD_API_SECRET,
});


// Create a storage object
// Instead of storing files locally,
// Multer will store them directly on Cloudinary
const storage = new CloudinaryStorage({

    // Use the configured cloudinary instance
    cloudinary: cloudinary,

    params: {

        // Folder name inside Cloudinary
        folder: "wanderlust_DEV",

        // Allowed image formats
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});


// Export both objects so we can use them elsewhere
module.exports = {

    // Used for deleting/updating images later
    cloudinary,

    // Used by multer for uploading
    storage
};