if(process.env.NODE_ENV = "production") {
    const dotenv = require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require('../schema.js');
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, createListing, showListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Router.route() method
router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing ,wrapAsync(createListing));

// new route
router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
.get(wrapAsync(showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// // index route
//     router.get("/",wrapAsync(index));


// // create route
// router.post("/", isLoggedIn, validateListing ,wrapAsync(createListing)
// );

// // show Route -> /listings/:id
// router.get("/:id", wrapAsync(showListing));

/**update route */
// edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(renderEditForm));

// // update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

// // Delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destroyListing));


module.exports = router;