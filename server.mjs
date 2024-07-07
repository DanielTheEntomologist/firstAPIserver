// const express = require("express");
import express from "express";
import path from "path";
import cors from "cors";

import testimonialsRoutes from "./routes/testimonials.routes.mjs";
import seatsRoutes from "./routes/seats.routes.mjs";
import concertsRoutes from "./routes/concerts.routes.mjs";

// set app and express settings
const app = express();

// set paths
const __dirname = path.resolve();
const staticPath = path.join(__dirname, "/public");

// set middleware
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api", testimonialsRoutes);
app.use("/api", seatsRoutes);
app.use("/api", concertsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found..." });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});
