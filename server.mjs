// const express = require("express");
import express from "express";
import path from "path";

// set app and express settings
const app = express();

// set paths
const __dirname = path.resolve();
const staticPath = path.join(__dirname, "/public");

// set middleware
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("*", (req, res) => {
  res.status(404);
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
