const Listing=  require("./models/listing");
const Review=require("./models/review");


module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "/listings"; // you can add this default if you want
    }
    next();
};


module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!req.user || !listing.owner._id.equals(req.user._id)){
        req.flash("error","You are not the Owner Of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author Of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

