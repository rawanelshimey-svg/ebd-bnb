
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  }
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
