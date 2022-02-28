const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bp = require("body-parser");

const app = express();
app.use(cors()); // so that app can access
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let bookings = JSON.parse(fs.readFileSync("./server/bookings.json")).map(
  (bookingRecord) => ({
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
  })
);

app.get("/bookings", (_, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const incomingBookings = req.body.bookings.map((booking) => ({
    ...booking,
    time: Date.parse(booking.time),
  }));
  bookings = [...bookings, ...incomingBookings];
  bookings.sort((a, b) => new Date(a.time) - new Date(b.time));
  res.json(bookings);
});

app.listen(3001);
