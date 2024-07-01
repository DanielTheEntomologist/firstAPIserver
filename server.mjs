// const express = require("express");
import express from "express";
import path from "path";
import cors from "cors";

import testimonialsRoutes from "./routes/testimonials.routes.mjs";

// set app and express settings
const app = express();

// set paths
const __dirname = path.resolve();
const staticPath = path.join(__dirname, "/public");

// set middleware
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api", testimonialsRoutes);

app.use((req, res) => {
  console.log("404");
  res.status(404).json({ message: "Not found..." });
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
