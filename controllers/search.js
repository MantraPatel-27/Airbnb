const Listing=require("../models/listing");

module.exports.search=async (req, res) => {
    let { search } = req.query;
    console.log(search)
    const allListings = await Listing.find({  country: { $regex: search, $options: "i" }});
    console.log(allListings);
    if(allListings.length==0){
        req.flash("error"," No listings found for the selected country")
        return res.redirect("/listings");

    }
    search=""
      req.flash("success","  listings found for the selected country")
    res.render("listings/index", { allListings });
};