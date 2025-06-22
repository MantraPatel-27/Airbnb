const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js")
const Review=require("../models/review");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage});



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body); //joi server side validation
    if(error){
        throw new ExpressError(400,error);
    }else{
        next()
    }


}


//all listings (Index Route)
router.get("/",wrapAsync(listingController.index));
//new route
router.get("/new",listingController.renderNewForm);



//post request to add data in db(Create Route)
router.post("/",upload.single('image'),wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isOwner,wrapAsync(listingController.renderEditForm));
//update route
router.put("/:id",upload.single('image'),isOwner,validateListing,wrapAsync(listingController.updateListing ));

//delete route
router.delete("/:id",isOwner,wrapAsync(listingController.deleteListing));





//show individual listing(Show Route)
router.get("/:id",wrapAsync(listingController.showListing));

module.exports=router