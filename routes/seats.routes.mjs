import express from "express";
import fulldb from "../db/db.mjs";
import randomId from "../utils.mjs";

const newId = () => randomId(10);
const db = fulldb.seats;
const collectionName = "seats";

const itemCreator = (requestBody) => {
  const { day, seat, client, email } = requestBody;
  return { day: day, seat: seat, client: client, email: email };
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

router.post(`/${collectionName}`, (req, res) => {
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
