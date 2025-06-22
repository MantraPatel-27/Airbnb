const Listing=require("../models/listing");
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'locationiq',
  apiKey: 'pk.34b4c744a563528e6d970089fc2b9aa4', 
  formatter: null
});

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
         res.render("listings/new.ejs");

    }
    
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner")
      console.log(req.user);
      console.log(listing);
    if(!listing){
          req.session.redirectUrl=req.originalUrl;
          req.flash("error"," Listing You Requested For Does Not Exist!");
          return res.redirect("/listings");

    }
    const geo = await geocoder.geocode(listing.location);
    const latitude = geo[0]?.latitude;
    const longitude = geo[0]?.longitude;

    res.render("listings/show.ejs",{listing, latitude, longitude});
}

module.exports.createListing=async(req,res)=>{
    let {title,description,price,location,country}=req.body;
    // if (!title || !location || !country || !description || !price ) {
    //     throw new ExpressError(400, "Send Valid Data For Listing");
    // }
    // let result=listingSchema.validate(req.body); //joi server side validation
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    let url=req.file.path;
    let filename=req.file.filename



    const newListing=new Listing({
        title:title,
        description:description,
        image:{url,filename},
        price:price,
        location:location,
        country:country,
        owner:req.user._id,
    });
    newListing.save();
      console.log(req.user);
    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
        req.flash("success","New Listing Created");
        res.redirect("/listings");
     

    }
    
 
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id);
      console.log(req.user);

    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
         res.render("listings/edit.ejs",{listing,originalImageUrl});

    }
   


}

module.exports.updateListing=async (req, res) => {
   
    // if (!title || !location || !country || !description || !price ) {
    //     throw new ExpressError(400, "Send Valid Data For Listing");
    // }

    
     const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    // If using image upload
    let updatedData = {
        title,
        description,
        price,
        location,
        country
    };

    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, updatedData, { new: true });
      console.log(req.user);
    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
        req.flash("success"," Listing Updated!");
        res.redirect(`/listings/${id}`);

    }
     
}

module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
      console.log(req.user);
    if(!req.isAuthenticated()){ //check if user is logged in or not if it is logge in than only he or she add new listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");

    }else{
        await Listing.findByIdAndDelete(id);
        req.flash("success"," Listing Deleted!");
        res.redirect("/listings");

    }
   
}