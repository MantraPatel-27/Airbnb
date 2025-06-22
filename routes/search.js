const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const searchController=require("../controllers/search");


router.get("/listings/search",searchController.search );



module.exports=router;