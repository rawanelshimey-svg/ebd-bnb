import express from "express";

const app = express();

// Our fake database
const listings = [
  { id: 1, title: "Nile View Apartment", pricePerNight: 85 },
  { id: 2, title: "Beach House", pricePerNight: 140 },
  { id: 3, title: "Desert Eco-Lodge", pricePerNight: 60 }
];

// Home page
app.get("/", (req, res) => {
  res.send("Welcome to ebd bnb");
});

// GET all listings
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

// GET one listing by ID
app.get("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find((listing) => listing.id === id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  res.json(listing);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});