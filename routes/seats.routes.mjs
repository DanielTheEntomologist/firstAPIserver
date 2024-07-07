import express from "express";
import fulldb from "../db/db.mjs";
import randomId from "../utils.mjs";

const newId = () => randomId(10);
const db = fulldb.seats;
const collectionName = "seats";
import { body, validationResult } from "express-validator";

const itemCreator = (requestBody) => {
  const { day, seat, client, email } = requestBody;
  return { day: day, seat: seat, client: client, email: email };
};

const availableDays = 3;
const availableSeats = 50;

const router = express.Router();

const bodyValidations = [
  body("day")
    .isInt({ min: 1, max: availableDays })
    .withMessage(
      "Day must be an integer greater than 0 and less than festival days number"
    ),
  body("seat")
    .isInt({ min: 1, max: availableSeats })
    .withMessage(
      "Seat must be an integer greater than 0 and no more than seats number"
    ),
  body("client")
    .trim() // Remove whitespace from both ends of a string
    .isLength({ min: 1 }) // Ensure 'client' is not empty
    .withMessage("Client name is required"),
  body("email")
    .isEmail() // Validate the email address
    .withMessage("Invalid email address"),
];

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
