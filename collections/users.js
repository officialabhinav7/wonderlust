const User = require("../models/user");

// Register a new user
const registerUser = async (username, email, password) => {
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    return registeredUser;
};

// Authenticate user login (handled by Passport, no DB operation needed here)
// This is included for completeness

module.exports = {
    registerUser
};
