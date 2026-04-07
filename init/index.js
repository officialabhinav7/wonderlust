const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("../models/listing");
const initdata = require("./data");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wonderlust");
}

main()
    .then(async() => {
        console.log("Connected to MongoDB");
         await initdb();
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/", (req, res) => {
    res.send("Hello World");
});

const initdb = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
};

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});