import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
import Listing from "./Listing.js";

dns.setServers(["8.8.8.8"]);
const app = express();

// ========== MIDDLEWARE ==========

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());

async function connectDB() {
  console.log("Connecting to MongoDB...");

  const uri = process.env.MONGODB_URI;

  await mongoose.connect(uri, {
    dbName: "ebd-bnb"
  });

  console.log("Connected to MongoDB");
}

// ========== MODEL ==========
// Model
function getAllListings() { 
  return listings;
}

function getListingById(id) {
 return listings.find((listing) => listing.id === id);
}

function addListing(data) { 
  const listing = {
    id: nextId++, 
    title: data.title,
    pricePerNight: data.pricePerNight,
 };
 listings.push(listing); 
 return listing;
}

function updateListing(id, data) {
  const listing = getListingById(id);
   if (listing) {
    listing.title = data.title; 
    listing.pricePerNight = data.pricePerNight;
 }
 return listing;
}

function removeListing(id) {
 const listing = getListingById(id);
 listings = listings.filter((item) => item.id !== id); 
 return listing;
}

//Controller
// ========== CONTROLLERS ==========

async function handleGetAll(req, res) {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}



async function handleGetOne(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid listing ID"
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch listing"
    });
  }
}



async function handleCreate(req, res) {
  try {
    const { title, pricePerNight } = req.body;

    if (!title || typeof pricePerNight !== "number") {
      return res.status(400).json({
        error: "Title and pricePerNight are required"
      });
    }

    const newListing = await Listing.create({
      title,
      pricePerNight
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create listing"
    });
  }
}



async function handleUpdate(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid listing ID"
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update listing"
    });
  }
}



async function handleDelete(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid listing ID"
      });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete listing"
    });
  }
}

// ========== ROUTES ==========
app.get("/", (req, res) => { res.send("Welcome to ebd bn'b");
});

app.get("/api/listings", handleGetAll);

app.get("/api/listings/:id", handleGetOne);

app.post("/api/listings", handleCreate);

app.put("/api/listings/:id", handleUpdate);

app.delete("/api/listings/:id", handleDelete);

// Start server
await connectDB();
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});