require("dotenv").config(); // Load environment variables from .env file

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Use the DB_URL from the .env file
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("DB_URL:", dbUrl);
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("DB_URL:", dbUrl);
    console.log("Error connecting to MongoDB:", err);
  });
