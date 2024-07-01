// const express = require("express");
import express from "express";
import path from "path";

import cors from "cors";

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

const db = [
  { id: 1, author: "John Doe", text: "This company is worth every coin!" },
  {
    id: 2,
    author: "Amanda Doe",
    text: "They really know how to make you happy.",
  },
];

const newId = () => {
  let id = db.length + 1;
  //while id not in db.map(item => item.id) return id
  while (db.map((item) => item.id).includes(id)) {
    id++;
  }
  return id;
};

// GET /testimonials – ma po prostu zwracać całą zawartość tablicy.
app.get("/testimonials", (req, res) => {
  res.json(db);
});
// GET /testimonials/:id – zwracamy tylko jeden element tablicy, zgodny z :id.
app.get("/testimonials/:id", (req, res) => {
  const testimonial = db.find((item) => item.id == req.params.id);
  if (!testimonial) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  res.json(testimonial);
});

// GET /testimonials/random – zwracamy losowy element z tablicy.
app.get("/testimonials/random", (req, res) => {
  const randomId = Math.floor(Math.random() * db.length);
  res.json(db.find((item) => item.id == randomId));
});

// POST /testimonials – dodajemy nowy element do tablicy. Możesz założyć, że body przekazywane przez klienta będzie obiektem z dwoma atrybutami author i text. Id dodawanego elementu musisz losować.
app.post("/testimonials", (req, res) => {
  const { author, text } = req.body;
  const id = newId();
  db.push({ id, author, text });
  res.json({ message: "OK" });
});
// PUT /testimonials/:id – modyfikujemy atrybuty author i text elementu tablicy o pasującym :id. Załóż, że body otrzymane w requeście będzie obiektem z atrybutami author i text.
app.put("/testimonials/:id", (req, res) => {
  const { author, text } = req.body;
  const testimonial = db.find((item) => item.id == req.params.id);
  if (!testimonial) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  testimonial.author = author;
  testimonial.text = text;
  res.json({ message: "OK" });
});
// DELETE /testimonials/:id – usuwamy z tablicy wpis o podanym id.
app.delete("/testimonials/:id", (req, res) => {
  const index = db.findIndex((item) => item.id == req.params.id);
  const testimonial = db.find((item) => item.id == req.params.id);
  if (!testimonial) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  db.splice(index, 1);
  res.json({ message: "OK" });
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
