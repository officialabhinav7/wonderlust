const mongoose=require("mongoose");
 const schema=mongoose.Schema;
 

 const listingSchema=new schema({
        title:
        {
            type:String,
            required:true,

        } ,
        description:String,
       image: {
   filename: String,
   url: String
},
        price:Number,
        
        location:String,
        country:String,
         reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ]

 })

 const listing=mongoose.model("listing",listingSchema);
 module.exports=listing;