const Listing=require("../models/listing");
const Review=require("../models/review");
 
module.exports.createReview=async(req,res)=>{

    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
            let {id}=req.params;
          let{comment,rating}=req.body;
          let listing=await Listing.findById(id);
        let newReview=new Review({
                 comment:comment,
                 rating:rating,
                author:req.user._id

            })
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log(newReview)

        console.log("New review Save");
        req.flash("success"," New Review Created!");
         res.redirect(`/listings/${id}`);
    

    }
    



}
module.exports.deleteReview=async(req,res)=>{
     if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`);

}