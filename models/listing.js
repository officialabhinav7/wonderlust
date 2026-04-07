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

 })

 const listing=mongoose.model("listing",listingSchema);
 module.exports=listing;