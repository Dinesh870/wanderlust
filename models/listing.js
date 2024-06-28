const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    // type: String,
    // default: "https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg?w=826&t=st=1710878385~exp=1710878985~hmac=e4e0793468ccaeb5afd2989a8d6c428352f86f917b2257bfba6d695872c83dd3",
    // set:(v)=>v===""?"https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg?w=826&t=st=1710878385~exp=1710878985~hmac=e4e0793468ccaeb5afd2989a8d6c428352f86f917b2257bfba6d695872c83dd3":v,

    // modified image
    url: String,
    filename: String,
},
  price: Number,
  location: String,
  country: String,
  reviews:[
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      },
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
