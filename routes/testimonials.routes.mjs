import express from "express";
import fulldb from "../db/db.mjs";
import randomId from "../utils.mjs";

import { body, validationResult } from "express-validator";

const newId = () => randomId(10);
const db = fulldb.testimonials;
const collectionName = "testimonials";

const bodyValidations = [
  body("text").isLength({ min: 20, max: 200 }).trim().escape(),
  body("author").isLength({ min: 5, max: 50 }).trim().escape(),
];

const itemCreator = (requestBody) => {
  const { author, text } = requestBody;
  return { author: author, text: text };
};

const router = express.Router();

router.get(`/${collectionName}`, (req, res) => {
  res.json(db);
});

router.get(`/${collectionName}/random`, (req, res) => {
  const ids = [...db.map((item) => item.id)];
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  res.json(db.find((item) => item.id == randomId));
});

router.get(`/${collectionName}/:id`, (req, res) => {
  const item = db.find((item) => item.id == req.params.id);
  if (!item) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  res.json(item);
});

router.post(`/${collectionName}`, bodyValidations, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const item = { id: newId(), ...itemCreator(req.body) };
  db.push(item);
  res.json({ message: "OK" });
});

router.put(`/${collectionName}/:id`, (req, res) => {
  const item = db.find((item) => item.id == req.params.id);
  if (!item) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const modifiedItem = itemCreator(req.body);

  // update object attributes without changing the reference
  Object.keys(modifiedItem).forEach((key) => {
    item[key] = modifiedItem[key];
  });

  res.json({ message: "OK" });
});

router.delete(`/${collectionName}/:id`, (req, res) => {
  const index = db.findIndex((item) => item.id == req.params.id);
  const item = db.find((item) => item.id == req.params.id);
  if (!item) {
    res.status(404).json({ message: "Not found..." });
    return;
  }
  db.splice(index, 1);
  res.json({ message: "OK" });
});

export default router;
