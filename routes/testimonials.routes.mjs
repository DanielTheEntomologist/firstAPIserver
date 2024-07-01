import express from "express";
import fulldb from "../db/db.mjs";
import randomId from "../utils.mjs";

const newId = () => randomId(10);
const db = fulldb.testimonials;

const router = express.Router();

// GET /testimonials – ma po prostu zwracać całą zawartość tablicy.
router.get("/testimonials", (req, res) => {
  res.json(db);
});

// GET /testimonials/random – zwracamy losowy element z tablicy.
router.get("/testimonials/random", (req, res) => {
  const ids = [...db.map((item) => item.id)];
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  res.json(db.find((item) => item.id == randomId));
});

// GET /testimonials/:id – zwracamy tylko jeden element tablicy, zgodny z :id.
router.get("/testimonials/:id", (req, res) => {
  const testimonial = db.find((item) => item.id == req.params.id);
  if (!testimonial) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  res.json(testimonial);
});

// POST /testimonials – dodajemy nowy element do tablicy. Możesz założyć, że body przekazywane przez klienta będzie obiektem z dwoma atrybutami author i text. Id dodawanego elementu musisz losować.
router.post("/testimonials", (req, res) => {
  const { author, text } = req.body;
  const id = newId();
  db.push({ id, author, text });
  res.json({ message: "OK" });
});
// PUT /testimonials/:id – modyfikujemy atrybuty author i text elementu tablicy o pasującym :id. Załóż, że body otrzymane w requeście będzie obiektem z atrybutami author i text.
router.put("/testimonials/:id", (req, res) => {
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
router.delete("/testimonials/:id", (req, res) => {
  const index = db.findIndex((item) => item.id == req.params.id);
  const testimonial = db.find((item) => item.id == req.params.id);
  if (!testimonial) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  db.splice(index, 1);
  res.json({ message: "OK" });
});

export default router;
