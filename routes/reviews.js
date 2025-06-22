const express=require("express");
const router=express.Router({mergeParams:true}); //id 
const {listingSchema,reviewSchema}=require("../schema");
const Review=require("../models/review");
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); //joi server side validation
    if(error){
        throw new ExpressError(400,error);
    }else{
        next()
    }


}

//Reviews
//post route
router.post("/",validateReview,wrapAsync(reviewController.createReview))

//Delete Review Route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router