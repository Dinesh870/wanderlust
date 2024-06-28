const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema } = require('../schema.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");


/** Reviews  */
// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// delete review rout
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));

module.exports = router;