const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const ejsmate=require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
const methodoverride=require("method-override");
app.use(methodoverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname, "public"))
);
const review=require("./models/review");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/expressError");
const { listingSchema } = require("./joi");


const validateListing = (req, res, next) => {
     
  const { error } = listingSchema.validate(req.body);

  if (error) {
    console.log(error);
    throw new ExpressError(400, error.details[0].message);
  }

  next();
};
async function main(){
    await mongoose.connect("mongodb://localhost:27017/wonderlust");
    console.log("Connected to MongoDB");
}


app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
})

main()
    .then(()=>{
        console.log("connected to mongodb")
    })
    .catch((err)=>{
        console.log(err);
    })
app.get("/",(req,res)=>{
    res.send("Hello World");
});

// app.get("/testlisting",async (req,res)=>{
//     let simplelisting=new listing({
//     title:"Beautiful Beach House",
//     description:"A stunning beach house with breathtaking ocean views. This property features 4 bedrooms, 3 bathrooms, and a spacious living area perfect for entertaining. Enjoy the private pool and direct access to the beach. Ideal for families or groups looking for a luxurious getaway.",
//     price:500,
//     Location:"Malibu",
//     country:"USA",
//     });
//     await simplelisting.save();
//     console.log("Listing saved to database");
//     res.send("successfull listing");

// });
app.get("/listings",async (req,res)=>{  
       
        const alllistings=await listing.find({});
        res.render("listings/index",{alllistings})
});
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let listing1 = await listing.findById(req.params.id).populate('reviews');
  if (!listing1) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show", { listing1}); // ✅ IMPORTANT
}));
app.post(
  "/listings",
  validateListing, // 👈 Joi middleware
  wrapAsync(async (req, res) => {
   
    const newlisting = new listing(req.body.listing);
    if (newlisting.image && typeof newlisting.image === 'string') {
      newlisting.image = { url: newlisting.image, filename: "listing-image" };
    }
    await newlisting.save();
    res.redirect("/listings");
  })
);
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
    let listingdata= await listing.findById(req.params.id);

    let newReview = new review(req.body.review);
    await newReview.save();

    listingdata.reviews.push(newReview);
    await listingdata.save();

    res.redirect(`/listings/${listingdata._id}`);
}));

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing1 =await listing.findById(id);
     res.render("listings/edit",{listing1 });
});
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,req.body);
     console.log(req.body);
    res.redirect(`/listings/${id}`);
});
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
      // Delete the actual review document
    await review.findByIdAndDelete(reviewid);
    // Remove the review reference from the listing
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    res.redirect(`/listings/${id}`);
}));

// 404 handler (for unknown routes)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// FINAL error handler (renders error.ejs)
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;

  res.status(status).render("listings/error.ejs", { err });
});





