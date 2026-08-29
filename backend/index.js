const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("EcoCycle Backend is running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "ecocycle"
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message);
});

// Server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});